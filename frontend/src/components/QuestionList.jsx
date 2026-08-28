import React from 'react';

export default function QuestionList({ questions, userAnswers, onAnswer }) {
  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div 
          key={q.id} 
          className="p-5 border border-slate-200 rounded-xl bg-white shadow-xs hover:border-slate-300 transition-colors"
        >
          {/* Question Title */}
          <p className="text-base font-semibold text-slate-800 mb-4">
            <span className="text-blue-600 mr-1.5">Q{idx + 1}.</span> {q.question}
          </p>

          {/* Options Container */}
          <div className="space-y-2.5">
            {q.options.map((opt) => {
              const isSelected = userAnswers[q.id] === opt;

              return (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 text-blue-950 shadow-xs ring-1 ring-blue-600/20'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={isSelected}
                    onChange={() => onAnswer(q.id, opt)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="select-none flex-1">{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}