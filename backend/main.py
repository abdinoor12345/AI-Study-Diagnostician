import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import pypdf
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Initialize Gemini Client
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}


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
        Analyze the following study notes and extract the top 3-5 core concepts.
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
        doc_res = requests.post(
            f"{SUPABASE_URL}/rest/v1/documents",
            headers=headers,
            json=[{"file_path": file.filename}]
        )
        doc_res.raise_for_status()
        doc_id = doc_res.json()[0]["id"]

        # 4. Save Concepts in Supabase
        concepts_to_insert = [
            {"document_id": doc_id, "name": c["name"], "description": c["description"]}
            for c in concepts_data["concepts"]
        ]
        con_res = requests.post(
            f"{SUPABASE_URL}/rest/v1/concepts",
            headers=headers,
            json=concepts_to_insert
        )
        con_res.raise_for_status()
        saved_concepts = con_res.json()

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
@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    data = request.get_json()
    concepts = data.get("concepts", [])
    quiz_type = data.get("quiz_type", "diagnostic")
    target_concept = data.get("target_concept", None)

    try:
        prompt = f"""
        Create a 5-question multiple-choice quiz based on these concepts: {json.dumps(concepts)}.
        Type: {quiz_type}
        Target Concept (if practice): {target_concept}

        Return STRICT JSON:
        {{
          "questions": [
            {{
              "id": 1,
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
        return jsonify(json.loads(response.text))

    except Exception as e:
        app.logger.exception("generate-quiz failed")
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


if __name__ == "__main__":
    app.run(port=8000, debug=True)