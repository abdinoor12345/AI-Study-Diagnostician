import React from 'react';

const STEPS = [
  {
    icon: '📄',
    title: 'Upload Your Notes',
    desc: 'Drop in a PDF of your study material — lecture slides, textbook chapters, or your own notes.',
  },
  {
    icon: '🧠',
    title: 'AI Extracts Concepts',
    desc: 'Gemini identifies the core concepts in your notes and builds a diagnostic quiz around them.',
  },
  {
    icon: '🎯',
    title: 'Find Your Weak Spot',
    desc: "Instead of just a score, you get a clear explanation of why you're struggling — not just what you got wrong.",
  },
  {
    icon: '📈',
    title: 'Practice & Improve',
    desc: 'Get a targeted lesson, retest on your weak concept, and watch your mastery score climb.',
  },
];

export default function HowItWorks() {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-800 text-center mb-6">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s, idx) => (
          <div
            key={s.title}
            className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-xs hover:shadow-sm transition-shadow"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <div className="text-xs font-semibold text-blue-600 mb-1">STEP {idx + 1}</div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">{s.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}