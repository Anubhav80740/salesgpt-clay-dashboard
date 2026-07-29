'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { PipelineFunnelChart } from '@/components/charts/PipelineFunnelChart';
import { PipelineStageCard } from '@/components/cards/PipelineStageCard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CardSkeleton } from '@/components/cards/LoadingSkeleton';
import { getPipelineData } from '@/services/dashboard';
import { GitMerge, Layers } from 'lucide-react';

export default function PipelinePage() {
  return (
    <DashboardShell>
      {({ filters, isRefreshing }) => {
        const stages = getPipelineData(filters);

        if (isRefreshing) {
          return (
            <div className="space-y-6">
              <CardSkeleton />
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          );
        }

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <SectionHeader
              title="Data Ingestion & Transformation Pipeline"
              description="Stage-by-stage progression of raw Clay data records through validation, deduplication, and CRM import."
            />

            {/* Recharts Funnel & Drop-off Chart */}
            <PipelineFunnelChart stages={stages} />

            {/* Stage Summary Banner */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-soft flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-salesgpt-600" />
                <span className="font-semibold text-slate-900">
                  10 Active Processing Stages
                </span>
                <span className="text-slate-500">
                  • End-to-End Retention Rate: <strong className="text-emerald-600 font-semibold">20.6% Net Qualified</strong>
                </span>
              </div>
            </div>

            {/* Vertical Flow Cards connected with arrows */}
            <div className="py-4 space-y-1">
              {stages.map((stage, index) => (
                <PipelineStageCard
                  key={stage.id}
                  stage={stage}
                  isLast={index === stages.length - 1}
                />
              ))}
            </div>
          </motion.div>
        );
      }}
    </DashboardShell>
  );
}
