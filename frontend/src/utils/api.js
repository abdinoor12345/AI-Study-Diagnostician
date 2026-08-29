const API_BASE = "http://127.0.0.1:8000";

// Wraps fetch: throws with the backend's error message if the response isn't OK
async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export function extractConcepts(file) {
  const formData = new FormData();
  formData.append("file", file);
  return fetchJson(`${API_BASE}/extract-concepts`, {
    method: "POST",
    body: formData,
  });
}

export function generateQuiz({ documentId, concepts, quizType, targetConcept = null }) {
  return fetchJson(`${API_BASE}/generate-quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      document_id: documentId,
      concepts,
      quiz_type: quizType,
      target_concept: targetConcept,
    }),
  });
}

export function submitQuiz({ quizId, responses }) {
  return fetchJson(`${API_BASE}/submit-quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quiz_id: quizId,
      responses,
    }),
  });
}

export function diagnoseWeakness({ weakConcept, recentFailures }) {
  return fetchJson(`${API_BASE}/diagnose-weakness`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      weak_concept: weakConcept,
      recent_failures: recentFailures,
    }),
  });
}

export function listDocuments() {
  return fetchJson(`${API_BASE}/documents`);
}

export function getDocumentHistory(documentId) {
  return fetchJson(`${API_BASE}/documents/${documentId}/history`);
}

export function getMasteryTrend(documentId) {
  return fetchJson(`${API_BASE}/documents/${documentId}/mastery-trend`);
}