import React from 'react';
import HowItWorks from './HowItWorks';

export default function UploadStep({ onFileUpload }) {
  return (
    <div>
    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-400 transition-colors duration-200 text-center group">
      {/* Upload Icon */}
      <div className="p-4 mb-4 rounded-full bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-200">
        <svg 
          className="w-8 h-8" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      {/* Headings */}
      <h2 className="text-xl font-semibold text-slate-800 mb-1">
        Upload Your PDF Notes
      </h2>
      <p className="text-sm text-slate-500 mb-20">
        Select a PDF file from your computer
      </p>

      {/* Custom Styled File Input */}
      <label className="cursor-pointer inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm hover:shadow transition-all">
        <span>Browse File</span>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={onFileUpload} 
          className="hidden" 
        />
      </label>
    </div>
    <HowItWorks/>
    </div>
    
  );
}