# test_grounding.py — run standalone, not through Flask
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Explain the OSI model and cite 1-2 credible sources with URLs. Return STRICT JSON: {\"lesson\": \"...\", \"resources\": [{\"title\": \"...\", \"url\": \"...\"}]}",
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())],
        response_mime_type="application/json"
    )
)
print(response.text)