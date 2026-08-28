import React from 'react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl mb-8 shadow-xl">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

      {/* Decorative Floating Learning Elements */}
      {/* Floating Book Icon - Top Left */}
      <div className="absolute top-4 left-6 text-white/10 animate-pulse hidden sm:block">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12z" />
        </svg>
      </div>

      {/* Floating Academic Cap - Bottom Right */}
      <div className="absolute bottom-4 right-8 text-white/10 hidden sm:block">
        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
      </div>

      {/* Hero Content Area */}
      <div className="relative px-8 py-14 sm:px-12 sm:py-16 text-center z-10">
        
        {/* Floating Mini Icons Bar */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {/* Books Icon */}
          <span className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm text-blue-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>

          {/* AI Badge Tag */}
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-blue-100 uppercase bg-white/10 rounded-full border border-white/20">
            AI-Powered Learning
          </span>

          {/* Sparkles Icon */}
          <span className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm text-blue-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          AI Study Diagnostician
        </h1>

        <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Upload your notes, find out exactly where you're struggling, and get
          a personalized lesson before you retest — powered by AI that
          explains <span className="text-white font-semibold">why</span>, not
          just what.
        </p>

        {/* Learning Material Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-blue-100/90 font-medium">
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <span>📚</span> PDF Notes & Transcripts
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <span>🎯</span> Diagnostic Quizzes
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <span>💡</span> Smart Targeted Lessons
          </span>
        </div>

      </div>
    </div>
  );
}