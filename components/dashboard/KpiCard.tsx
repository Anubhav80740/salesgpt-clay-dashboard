import React from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowRight } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import Link from 'next/link';

interface OverviewKpiCardsProps {
  metrics: {
    totalSalesGPT: number;
    totalClay: number;
    matchedCompanies: number;
    duplicateRowsRemoved: number;
    clayOnlyNewCompanies: number;
  };
}

export function OverviewKpiCards({ metrics }: OverviewKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Tech Companies */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Total Tech Companies</span>
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">SalesGPT</div>
              <div className="text-2xl font-extrabold text-blue-600 tracking-tight mt-0.5">
                {formatNumber(metrics.totalSalesGPT)}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 font-medium">Clay</div>
              <div className="text-2xl font-extrabold text-emerald-600 tracking-tight mt-0.5">
                {formatNumber(metrics.totalClay)}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">After basic dedupe & filters</p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <Link
            href="/countries"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>

      {/* Card 2: Overlap (Potential Matches) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Overlap (Potential Matches)</span>
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="mt-3">
            <div className="text-3xl font-extrabold text-indigo-600 tracking-tight">
              {formatNumber(metrics.matchedCompanies)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Companies present in both</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <Link
            href="/countries"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>

      {/* Card 3: Duplicates Removed */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Duplicates Removed</span>
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-600 tracking-tight">
              {formatNumber(metrics.duplicateRowsRemoved)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">From Clay dataset</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <Link
            href="/duplicates"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
          >
            <span>View Duplicates</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>

      {/* Card 4: New Companies in Clay */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>New Companies in Clay</span>
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </div>

          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              {formatNumber(metrics.clayOnlyNewCompanies)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Not present in SalesGPT</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <Link
            href="/pipeline"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
          >
            <span>View Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
