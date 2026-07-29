import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { PipelineStageRecord } from '@/types';
import { formatNumber } from '@/utils/formatters';

interface PipelineStageCardProps {
  stage: PipelineStageRecord;
  isLast: boolean;
}

export function PipelineStageCard({ stage, isLast }: PipelineStageCardProps) {
  const isFailed = stage.stageName === 'Failed';

  return (
    <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: stage.stageOrder * 0.04 }}
        className={`w-full bg-white rounded-xl border p-5 shadow-card hover:shadow-md transition-shadow relative ${
          isFailed ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                isFailed
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-blue-50 text-salesgpt-600 border border-blue-100'
              }`}
            >
              {stage.stageOrder}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-base">{stage.stageName}</h3>
                {isFailed ? (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{stage.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="text-left sm:text-right">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatNumber(stage.count)}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Companies</div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                  isFailed
                    ? 'bg-rose-100 text-rose-800'
                    : stage.completionPct >= 90
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {stage.completionPct.toFixed(1)}% Retained
              </span>
              <div className="text-[11px] text-slate-400 mt-1">
                {stage.dropoffPct > 0 ? `-${stage.dropoffPct.toFixed(1)}% drop` : 'Baseline'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {!isLast && (
        <div className="flex flex-col items-center my-2 text-slate-400">
          <div className="w-0.5 h-4 bg-slate-200" />
          <ChevronDown className="w-4 h-4 -mt-1 text-slate-400" />
        </div>
      )}
    </div>
  );
}
