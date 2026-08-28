import React from 'react';
import QuestionList from './QuestionList';

export default function PracticeStep({ questions, userAnswers, onAnswer, onSubmit }) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Practice Reassessment
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Answer the following targeted questions to test your updated understanding.
        </p>
      </div>

      {/* Questions Component */}
      <QuestionList 
        questions={questions} 
        userAnswers={userAnswers} 
        onAnswer={onAnswer} 
      />

      {/* Submit Button Bar */}
      <div className="pt-4 flex justify-end">
        <button 
          onClick={onSubmit} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Complete Reassessment
        </button>
      </div>
    </div>
  );
}