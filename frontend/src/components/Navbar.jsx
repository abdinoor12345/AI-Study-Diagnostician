import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="w-full bg-white/70 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="text-lg">🎓</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
              AI Study Diagnostician
            </span>
            <span className="hidden sm:block text-[11px] font-medium text-slate-400 tracking-wide">
              Learn smarter, not harder
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            Study
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            My Progress
          </NavLink>
        </div>
      </div>
    </nav>
  );
}