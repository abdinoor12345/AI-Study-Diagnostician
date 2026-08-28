export default function LessonStep({ weakestConcept, lessonText, onStartPractice }) {
  return (
    <div>
      <h2>Targeted Lesson: {weakestConcept}</h2>
      <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '8px', lineHeight: '1.6', marginBottom: '20px' }}>
        {lessonText}
      </div>
      <button onClick={onStartPractice} style={{ padding: '12px 24px', backgroundColor: '#16A34A', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        Start Practice Quiz
      </button>
    </div>
  );
}