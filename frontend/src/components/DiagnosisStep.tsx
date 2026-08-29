type DiagnosisStepProps = {
  weakestConcept: string | null;
  weakestConceptId: string | null;
  initialMastery: Record<string, number>;
  overallMastery: number;
  diagnosis: Record<string, any> | null;
  onContinue: () => void;
};

export default function DiagnosisStep({
  weakestConcept,
  weakestConceptId,
  initialMastery,
  overallMastery,
  diagnosis,
  onContinue,
}: DiagnosisStepProps) {
  const mastery = weakestConceptId ? initialMastery[weakestConceptId] ?? 0 : 0;

  return (
    <div>
      <h2>Diagnostic Results</h2>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#64748B' }}>Overall Score</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B' }}>{overallMastery}%</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Weakest Area: {weakestConcept}</h3>
          <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 'bold' }}>
            Mastery: {mastery}%
          </span>
        </div>

        <div style={{ backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B', padding: '14px', borderRadius: '4px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 6px 0', color: '#92400E' }}>Why we think you're struggling</h4>
          <p style={{ margin: 0, color: '#78350F' }}>{diagnosis?.reasoning}</p>
        </div>

        <div style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #3B82F6', padding: '14px', borderRadius: '4px', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 6px 0', color: '#1E40AF' }}>What we'll do</h4>
          <p style={{ margin: 0, color: '#1E3A8A' }}>{diagnosis?.remediation_plan}</p>
        </div>

        <button onClick={onContinue} style={{ width: '100%', padding: '12px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          View Adaptive Lesson
        </button>
      </div>
    </div>
  );
}