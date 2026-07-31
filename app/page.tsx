'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { OverviewKpiCards } from '@/components/dashboard/KpiCard';
import { CoverageOverviewTable } from '@/components/tables/CoverageOverviewTable';
import { WeeklyTechTrendChart } from '@/components/charts/WeeklyTechTrendChart';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CardSkeleton } from '@/components/cards/LoadingSkeleton';
import {
  getOverviewMetrics,
  getCountryComparisonData,
} from '@/services/dashboard';
import { Info } from 'lucide-react';

export default function OverviewPage() {
  const [cachedQueries, setCachedQueries] = useState<Record<string, Record<string, { count: number }>>>({});

  const reloadCache = React.useCallback(async () => {
    try {
      const res = await fetch('/api/supabase-query-suite?cached=all', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.queries) {
        setCachedQueries(data.queries);
      }
    } catch (e) {
      console.error('Failed to load live query cache on Overview page:', e);
    }
  }, []);

  React.useEffect(() => {
    reloadCache();

    // Trigger background daily auto-scan if today's snapshot file doesn't exist yet
    fetch('/api/supabase-query-suite?action=auto_daily_check', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && !data.alreadyScannedToday) {
          reloadCache();
        }
      })
      .catch((err) => console.error('Daily check error:', err));

    // Listen to query execution updates
    const handleUpdate = () => reloadCache();
    window.addEventListener('queryCacheUpdated', handleUpdate);
    return () => window.removeEventListener('queryCacheUpdated', handleUpdate);
  }, [reloadCache]);

  return (
    <DashboardShell>
      {({ filters, isRefreshing }) => {
        const metrics = getOverviewMetrics(filters, cachedQueries);
        const countries = getCountryComparisonData(filters, cachedQueries);

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
            {/* Top Page Header */}
            <SectionHeader
              title="Data Overview"
              description="High-level evaluation of tech company coverage, headcount density, and database overlap"
            />

            {/* Row 1: 4 Top KPI Cards */}
            <OverviewKpiCards metrics={metrics} />

            {/* Row 2: Weekly Tech Companies Trend Chart */}
            <WeeklyTechTrendChart />

            {/* Row 3: Coverage by Country (Tech Companies) Table */}
            <CoverageOverviewTable data={countries} />

            {/* Footer Indicative Note */}
            <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Numbers are live-synced from database queries and daily snapshot logs.</span>
            </div>
          </motion.div>
        );
      }}
    </DashboardShell>
  );
}
