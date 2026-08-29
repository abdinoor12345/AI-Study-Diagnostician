 import React from 'react';

export default function ResultsStep({ initialMastery = {}, finalMastery = {}, conceptNames, onRestart }) {
  console.log('DEBUG conceptNames:', conceptNames);
  console.log('DEBUG finalMastery:', finalMastery);
  const conceptIds = Object.keys(finalMastery).filter((id) => id !== 'undefined' && id !== 'null');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Final Mastery Progress
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Here is how your concept understanding improved after completing the lesson.
        </p>
      </div>

      {/* Table Card Container */}
      <div className="overflow-hidden border border-slate-200 rounded-xl shadow-xs bg-white">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="p-4">Concept</th>
              <th className="p-4">Before Score</th>
              <th className="p-4">After Score</th>
              <th className="p-4 text-right">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {conceptIds.map((cid) => {
              const before = initialMastery[cid] ?? 0;
              const after = finalMastery[cid] ?? 0;
              const growth = after - before;
              return (
                <tr key={cid} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">
                    {conceptNames?.[cid] ?? 'Unknown Concept'}
                  </td>
                  <td className="p-4 text-rose-600 font-medium">{before}%</td>
                  <td className="p-4 text-emerald-600 font-semibold">{after}%</td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        growth > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : growth < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {growth > 0 ? `+${growth}%` : `${growth}%`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white font-medium text-sm rounded-lg shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          Process Another PDF
        </button>
      </div>
    </div>
  );
}