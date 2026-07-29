'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { OverviewKpiCards } from '@/components/dashboard/KpiCard';
import { CoverageOverviewTable } from '@/components/tables/CoverageOverviewTable';
import { DuplicatePieChart } from '@/components/charts/DuplicatePieChart';
import { FiltersCleaningCard } from '@/components/dashboard/FiltersCleaningCard';
import { PipelineOverviewCard } from '@/components/dashboard/PipelineOverviewCard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CardSkeleton } from '@/components/cards/LoadingSkeleton';
import {
  getOverviewMetrics,
  getCountryComparisonData,
  getDuplicatesData,
  getPipelineData,
} from '@/services/dashboard';
import { Info } from 'lucide-react';

export default function OverviewPage() {
  return (
    <DashboardShell>
      {({ filters, isRefreshing }) => {
        const metrics = getOverviewMetrics(filters);
        const countries = getCountryComparisonData(filters);
        const duplicates = getDuplicatesData(filters);
        const pipelineStages = getPipelineData(filters);

        if (isRefreshing) {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            className="space-y-6 pb-6"
          >
            {/* Top Page Header matching screenshot */}
            <SectionHeader
              title="Data Overview"
              description="Compare data coverage, duplicates and pipeline health across sources"
            />

            {/* Row 1: 4 Top KPI Cards */}
            <OverviewKpiCards metrics={metrics} />

            {/* Row 2: Side-by-Side (Coverage by Country + Duplicates Summary Donut) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <CoverageOverviewTable data={countries} />
              </div>
              <div className="lg:col-span-5">
                <DuplicatePieChart
                  data={duplicates.types}
                  totalRemoved={duplicates.overview.duplicateRowsRemoved}
                />
              </div>
            </div>

            {/* Row 3: Side-by-Side (Filters & Cleaning Applied + Pipeline Overview) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <FiltersCleaningCard />
              </div>
              <div className="lg:col-span-6">
                <PipelineOverviewCard stages={pipelineStages} />
              </div>
            </div>

            {/* Footer Indicative Note matching screenshot */}
            <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Numbers are indicative and based on current filters. Click on cards for more details.</span>
            </div>
          </motion.div>
        );
      }}
    </DashboardShell>
  );
}
