import React, { useState, useEffect } from 'react';
import { listDocuments, getDocumentHistory } from '../utils/api';

export default function Dashboard({ onBack }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDocuments().then((docs) => {
      setDocuments(docs);
      setLoading(false);
    });
  }, []);

  const handleSelectDoc = async (doc) => {
    setSelectedDoc(doc);
    const data = await getDocumentHistory(doc.id);
    setHistory(data);
  };

  if (loading) return <p className='p-5 text-red-500'>Loading your progress...</p>;

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: '16px', padding: '8px 16px', border: '1px solid #CBD5E1', borderRadius: '6px', background: 'none', cursor: 'pointer' }}>
        ← Back
      </button>
      <h2 className='text-xl font-bold mb-4 text-center' >Your Learning History</h2>

      {!selectedDoc && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleSelectDoc(doc)}
              style={{ textAlign: 'left', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FFF', cursor: 'pointer' }}
            >
              <strong>{doc.file_path}</strong>
              <div style={{ fontSize: '13px', color: '#64748B' }}>
                {new Date(doc.created_at).toLocaleDateString()}
              </div>
            </button>
          ))}
          {documents.length === 0 && <p>No documents uploaded yet.</p>}
        </div>
      )}

      {selectedDoc && history && (
        <div>
          <h3>{selectedDoc.file_path}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Concept</th>
                <th style={{ padding: '10px' }}>Current Mastery</th>
              </tr>
            </thead>
            <tbody>
              {history.concepts.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px' }}>{c.name}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${c.mastery_score}%`,
                          height: '100%',
                          backgroundColor: c.mastery_score >= 70 ? '#16A34A' : c.mastery_score >= 40 ? '#F59E0B' : '#DC2626'
                        }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{c.mastery_score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}