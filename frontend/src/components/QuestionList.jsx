import React from 'react';

export default function QuestionList({ questions, userAnswers, onAnswer }) {
  return (
    <>
      {questions.map((q, idx) => (
        <div 
          key={q.temp_id} 
          className="mb-5 p-4 border border-slate-200 rounded-lg bg-white"
        >
          <p className="text-base text-slate-800 font-semibold mb-3">
            Q{idx + 1}: {q.question}
          </p>

          {q.options.map((opt) => (
            <label 
              key={opt} 
              className="block my-2 text-sm text-slate-700 font-medium cursor-pointer"
            >
              <input
                type="radio"
                name={`q-${q.temp_id}`}
                value={opt}
                checked={userAnswers[q.temp_id] === opt}
                onChange={() => onAnswer(q.temp_id, opt)}
                className="mr-2 text-blue-600 border-slate-300 focus:ring-blue-500"
              /> 
              {opt}
            </label>
          ))}
        </div>
      ))}
    </>
  );
}