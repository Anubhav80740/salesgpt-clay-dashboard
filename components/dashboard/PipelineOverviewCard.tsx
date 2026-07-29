import React from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import Link from 'next/link';

interface PipelineOverviewCardProps {
  stages: Array<{ stageName: string; count: number }>;
}

export function PipelineOverviewCard({ stages }: PipelineOverviewCardProps) {
  const totalNew = stages.find((s) => s.stageName === 'Deduped')?.count || 51349;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            Pipeline (Clay New Companies)
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </h3>
        </div>

        <p className="text-[11px] text-slate-500 mb-3">
          New companies identified in Clay not present in SalesGPT.
        </p>

        <div className="mt-1">
          <div className="text-3xl font-extrabold text-blue-600 tracking-tight font-mono">
            {formatNumber(totalNew)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Total New</div>
        </div>

        {/* Horizontal Progress Bar matching screenshot */}
        <div className="mt-6">
          <div className="relative flex items-center justify-between">
            {/* Connecting colored lines */}
            <div className="absolute top-1.5 left-4 right-4 h-0.5 bg-slate-200 -z-0">
              <div className="h-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 w-full" />
            </div>

            {/* Nodes */}
            <div className="z-10 text-center">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-600 mx-auto ring-4 ring-white" />
              <div className="text-[10px] font-semibold text-blue-600 mt-1">Raw Found</div>
              <div className="text-[11px] font-mono font-bold text-slate-800">
                {formatNumber(stages[0]?.count || 68214)}
              </div>
            </div>

            <div className="z-10 text-center">
              <div className="w-3.5 h-3.5 rounded-full bg-teal-600 mx-auto ring-4 ring-white" />
              <div className="text-[10px] font-semibold text-teal-600 mt-1">After Filters</div>
              <div className="text-[11px] font-mono font-bold text-slate-800">
                {formatNumber(stages[1]?.count || 55812)}
              </div>
            </div>

            <div className="z-10 text-center">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 mx-auto ring-4 ring-white" />
              <div className="text-[10px] font-semibold text-emerald-600 mt-1">Deduped</div>
              <div className="text-[11px] font-mono font-bold text-slate-800">
                {formatNumber(stages[2]?.count || 51349)}
              </div>
            </div>

            <div className="z-10 text-center">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 mx-auto ring-4 ring-white" />
              <div className="text-[10px] font-semibold text-amber-600 mt-1">Ready for Enrichment</div>
              <div className="text-[11px] font-mono font-bold text-slate-800">
                {formatNumber(stages[3]?.count || 51349)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">Updated: 21 Jul 2026, 10:30 AM</span>
        <Link
          href="/pipeline"
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
        >
          <span>View Pipeline Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
