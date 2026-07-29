import React from 'react';
import { formatNumber } from '@/utils/formatters';

interface HorizontalComparisonBarProps {
  breakdown: {
    salesgptOnly: number;
    salesgptOnlyPct: number;
    overlap: number;
    overlapPct: number;
    clayOnly: number;
    clayOnlyPct: number;
  };
}

export function HorizontalComparisonBar({ breakdown }: HorizontalComparisonBarProps) {
  const total = breakdown.salesgptOnly + breakdown.overlap + breakdown.clayOnly;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-soft mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Database Distribution Breakdown</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total unique companies across both ecosystems ({formatNumber(total)})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-salesgpt-600 inline-block" />
            <span className="text-slate-600 font-medium">SalesGPT Only</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indigo-600 inline-block" />
            <span className="text-slate-600 font-medium">Matched Overlap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-clay-600 inline-block" />
            <span className="text-slate-600 font-medium">Clay Only</span>
          </div>
        </div>
      </div>

      {/* Stacked Horizontal Bar */}
      <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex p-1 gap-1">
        <div
          className="bg-salesgpt-600 h-full rounded-md transition-all duration-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden"
          style={{ width: `${breakdown.salesgptOnlyPct}%` }}
          title={`SalesGPT Only: ${formatNumber(breakdown.salesgptOnly)} (${breakdown.salesgptOnlyPct}%)`}
        >
          {breakdown.salesgptOnlyPct > 8 && `${breakdown.salesgptOnlyPct}%`}
        </div>

        <div
          className="bg-indigo-600 h-full rounded-md transition-all duration-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden"
          style={{ width: `${breakdown.overlapPct}%` }}
          title={`Matched Overlap: ${formatNumber(breakdown.overlap)} (${breakdown.overlapPct}%)`}
        >
          {breakdown.overlapPct > 8 && `${breakdown.overlapPct}%`}
        </div>

        <div
          className="bg-clay-600 h-full rounded-md transition-all duration-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden"
          style={{ width: `${breakdown.clayOnlyPct}%` }}
          title={`Clay Only: ${formatNumber(breakdown.clayOnly)} (${breakdown.clayOnlyPct}%)`}
        >
          {breakdown.clayOnlyPct > 8 && `${breakdown.clayOnlyPct}%`}
        </div>
      </div>

      {/* Detailed numbers summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100 text-center">
        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/60">
          <div className="text-xs text-slate-500 font-medium">SalesGPT Proprietary</div>
          <div className="text-lg font-bold text-salesgpt-600 mt-0.5">
            {formatNumber(breakdown.salesgptOnly)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">{breakdown.salesgptOnlyPct}% of total</div>
        </div>

        <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/60">
          <div className="text-xs text-slate-500 font-medium">Cross-Verified Overlap</div>
          <div className="text-lg font-bold text-indigo-600 mt-0.5">
            {formatNumber(breakdown.overlap)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">{breakdown.overlapPct}% of total</div>
        </div>

        <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/60">
          <div className="text-xs text-slate-500 font-medium">Clay Net New Discovered</div>
          <div className="text-lg font-bold text-clay-600 mt-0.5">
            {formatNumber(breakdown.clayOnly)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">{breakdown.clayOnlyPct}% of total</div>
        </div>
      </div>
    </div>
  );
}
