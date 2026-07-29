import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

export function FiltersCleaningCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            Filters & Cleaning Applied
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {/* Column 1: Filters Applied */}
          <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/60">
            <h4 className="text-[11px] font-bold text-slate-900 mb-2.5">Filters Applied</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold text-slate-900">Industry contains:</strong> software, saas, technology, it, ai, cloud, data, security
                </span>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold text-slate-900">Employee count:</strong> 5 – 1500
                </span>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold text-slate-900">Country is valid</strong>
                </span>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold text-slate-900">Active domain exists</strong>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Cleaning Rules */}
          <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/60">
            <h4 className="text-[11px] font-bold text-slate-900 mb-2.5">Cleaning Rules</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>Removed duplicates (domain + name variants)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>Standardized company names (case, spaces, symbols)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>Normalized domains (www, http/https removed)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>Removed test, demo, sample records</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
