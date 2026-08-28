import React from 'react';

export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-transparent text-slate-600 border border-slate-300 rounded-md mb-4 text-sm hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
    >
      ← Back
    </button>
  );
}