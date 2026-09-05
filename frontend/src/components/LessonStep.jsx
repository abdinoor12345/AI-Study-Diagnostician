import React from 'react';

export default function LessonStep({ weakestConcept, lessonText, onStartPractice }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 rounded-full border border-blue-100">
          Targeted Lesson
        </span>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {weakestConcept}
        </h2>
      </div>

      {/* Lesson content card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 leading-relaxed text-slate-700 text-sm whitespace-pre-line">
        {lessonText}
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <button
          onClick={onStartPractice}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm rounded-lg shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Start Practice Quiz
        </button>
      </div>
    </div>
  );
}