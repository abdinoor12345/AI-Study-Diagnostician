import React from 'react';

const STEPS = [
  { key: 'upload', label: 'Upload' },
  { key: 'quiz', label: 'Diagnostic' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'lesson', label: 'Lesson' },
  { key: 'practice', label: 'Practice' },
  { key: 'results', label: 'Results' },
];

export default function StepNav({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav className="w-full mb-8 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
      <div className="flex items-center justify-between min-w-[500px] sm:min-w-0">
        {STEPS.map((s, idx) => {
          const isActive = idx === currentIndex;
          const isDone = idx < currentIndex;

          return (
            <div key={s.key} className="flex-1 flex items-center last:flex-none">
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center flex-shrink-0 group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-xs mt-2 transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? 'font-bold text-slate-900'
                      : isDone
                      ? 'font-medium text-slate-700'
                      : 'text-slate-400 font-normal'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector Bar */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-5 transition-colors duration-300 ${
                    idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}