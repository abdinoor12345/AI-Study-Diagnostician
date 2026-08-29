import os
import json
import random
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import pypdf
from google import genai
from google.genai import types
from dotenv import load_dotenv

from supabase_client import insert, select, update

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Initialize Gemini Client
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.route("/", methods=["GET"])
def root():
    return jsonify({"status": "Backend running and connected to Supabase!"})


# MVP Steps 1 & 2: Extract Concepts & Save to Database
@app.route("/extract-concepts", methods=["POST"])
def extract_concepts():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        # 1. Parse PDF
        reader = pypdf.PdfReader(file)
        extracted_text = ""
        for page in reader.pages:
            extracted_text += page.extract_text() or ""

        # 2. Extract concepts via Gemini
        prompt = f"""
        Analyze the following study notes and extract the top 2 core concepts only.
        Return STRICT JSON in this exact structure:
        {{
          "concepts": [
            {{"name": "Concept Name", "description": "Brief description"}}
          ]
        }}
        Notes Content:
        {extracted_text[:4000]}
        """

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        concepts_data = json.loads(response.text)

        # 3. Save Document entry in Supabase
        doc_res = insert("documents", [{"file_path": file.filename}])
        doc_id = doc_res[0]["id"]  # uuid

        # 4. Save Concepts in Supabase
        concepts_to_insert = [
            {"document_id": doc_id, "name": c["name"], "description": c["description"]}
            for c in concepts_data["concepts"]
        ]
        saved_concepts = insert("concepts", concepts_to_insert)  # each row includes its uuid id + mastery_score default 0.0

        return jsonify({
            "document_id": doc_id,
            "concepts": saved_concepts
        })

    except requests.exceptions.HTTPError as e:
        app.logger.exception("Supabase request failed")
        return jsonify({"error": f"Supabase error: {e.response.text if e.response is not None else str(e)}"}), 500
    except Exception as e:
        app.logger.exception("extract-concepts failed")
        return jsonify({"error": str(e)}), 500


# MVP Step 3: Generate Quiz (Diagnostic or Practice)
# Saves the quiz row now; individual questions are only written to quiz_responses
# once answered (that table requires user_answer + is_correct, so it can't hold
# unanswered questions).
@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    data = request.get_json()
    document_id = data.get("document_id")
    concepts = data.get("concepts", [])  # [{id, name, description, mastery_score}, ...]
    quiz_type = data.get("quiz_type", "diagnostic")
    target_concept = data.get("target_concept", None)

    try:
        concept_names = [c["name"] for c in concepts]
        prompt = f"""
        Create a multiple-choice quiz based on these concepts: {json.dumps(concept_names)}.
        Generate a total of exactly 5 questions, split as evenly as possible across the
        given concepts (e.g. for 2 concepts: 3 and 2).
        Type: {quiz_type}
        Target Concept (if practice): {target_concept}

        Return STRICT JSON:
        {{
          "questions": [
            {{
              "concept_name": "Concept Name",
              "question": "Question text...",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "answer": "Option A",
              "error_tag": "calculation"
            }}
          ]
        }}
        """

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        quiz_data = json.loads(response.text)

        # Hard cap — never trust the model to obey "5 total" exactly
        quiz_data["questions"] = quiz_data["questions"][:5]

        # Shuffle each question's options so the correct answer isn't always
        # in the same slot (Gemini tends to place it first otherwise).
        # Scoring is unaffected since `answer` is matched by text, not position.
        for q in quiz_data["questions"]:
            random.shuffle(q["options"])

        # Save the quiz record
        quiz_row = insert("quizzes", [{
            "document_id": document_id,
            "quiz_type": quiz_type
        }])
        quiz_id = quiz_row[0]["id"]

        # Attach concept_id + a frontend-local temp_id to each question
        # (no DB id yet — that's assigned when the answer is submitted)
        name_to_id = {c["name"]: c["id"] for c in concepts}
        for idx, q in enumerate(quiz_data["questions"]):
            q["temp_id"] = idx
            q["concept_id"] = name_to_id.get(q["concept_name"])

        quiz_data["quiz_id"] = quiz_id
        return jsonify(quiz_data)

    except Exception as e:
        app.logger.exception("generate-quiz failed")
        return jsonify({"error": str(e)}), 500


# Submit quiz: writes each answered question to quiz_responses,
# then updates mastery_score on each affected concept.
@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.get_json()
    quiz_id = data.get("quiz_id")
    responses = data.get("responses", [])
    # responses: [{concept_id, question, user_answer, correct_answer, error_tag}]

    try:
        response_rows = [{
            "quiz_id": quiz_id,
            "concept_id": r["concept_id"],
            "question": r["question"],
            "user_answer": r["user_answer"] or "No Answer",
            "is_correct": r["user_answer"] == r["correct_answer"],
            "error_category": r.get("error_tag")
        } for r in responses]

        insert("quiz_responses", response_rows)

        # Compute mastery per concept from this batch, write to concepts.mastery_score
        concept_stats = {}
        for r in response_rows:
            cid = r["concept_id"]
            if cid not in concept_stats:
                concept_stats[cid] = {"correct": 0, "total": 0}
            concept_stats[cid]["total"] += 1
            if r["is_correct"]:
                concept_stats[cid]["correct"] += 1

        mastery_by_concept = {}
        for cid, stat in concept_stats.items():
            score = round((stat["correct"] / stat["total"]) * 100, 1) if stat["total"] else 0
            mastery_by_concept[cid] = score
            update("concepts", {"id": f"eq.{cid}"}, {"mastery_score": score})

        return jsonify({"status": "saved", "mastery_by_concept": mastery_by_concept})

    except Exception as e:
        app.logger.exception("submit-quiz failed")
        return jsonify({"error": str(e)}), 500


# MVP Steps 5 & 6: Diagnostician Engine ("Why are you struggling?")
@app.route("/diagnose-weakness", methods=["POST"])
def diagnose_weakness():
    data = request.get_json()
    weak_concept = data.get("weak_concept")
    recent_failures = data.get("recent_failures", [])

    try:
        prompt = f"""
        You are an expert AI tutor. Analyze why the student is struggling with '{weak_concept}'.
        Here are their recent wrong answers:
        {json.dumps(recent_failures)}

        Generate a diagnostic insight and a step-by-step remediation plan.
        Return STRICT JSON:
        {{
          "reasoning": "You correctly identify {weak_concept} concepts, but your last incorrect answers involved...",
          "remediation_plan": "Start with a simple example, work through one together, then attempt practice questions.",
          "adaptive_lesson": "Short, clear lesson text target-fitted to fix this specific misconception..."
        }}
        """

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        return jsonify(json.loads(response.text))

    except Exception as e:
        app.logger.exception("diagnose-weakness failed")
        return jsonify({"error": str(e)}), 500


# Retrieval
@app.route("/documents", methods=["GET"])
def list_documents():
    try:
        docs = select("documents", {"select": "*", "order": "created_at.desc"})
        return jsonify(docs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/documents/<document_id>/history", methods=["GET"])
def document_history(document_id):
    try:
        concepts = select("concepts", {"document_id": f"eq.{document_id}"})
        quizzes = select("quizzes", {"document_id": f"eq.{document_id}", "order": "created_at.asc"})
        return jsonify({
            "concepts": concepts,  # includes current mastery_score per concept
            "quizzes": quizzes
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/documents/<document_id>/mastery-trend", methods=["GET"])
def mastery_trend(document_id):
    try:
        concepts = select("concepts", {"document_id": f"eq.{document_id}"})
        concept_ids = [c["id"] for c in concepts]
        id_to_name = {c["id"]: c["name"] for c in concepts}

        trend = {}
        for cid in concept_ids:
            responses = select("quiz_responses", {
                "concept_id": f"eq.{cid}",
                "order": "created_at.asc"
            })
            points = []
            correct_so_far = 0
            for i, r in enumerate(responses, start=1):
                if r["is_correct"]:
                    correct_so_far += 1
                points.append({
                    "attempt": i,
                    "accuracy": round((correct_so_far / i) * 100, 1),
                    "timestamp": r["created_at"]
                })
            trend[id_to_name[cid]] = points

        return jsonify({"trend": trend, "concepts": concepts})
    except Exception as e:
        app.logger.exception("mastery-trend failed")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)