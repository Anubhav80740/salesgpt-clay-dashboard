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
import { LiveQueryTesterCard } from '@/components/dashboard/LiveQueryTesterCard';
import { Info, Database, ChevronDown, ChevronUp } from 'lucide-react';

export default function OverviewPage() {
  const [cachedQueries, setCachedQueries] = useState<Record<string, Record<string, { count: number }>>>({});
  const [showQuerySuite, setShowQuerySuite] = useState(false);

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

    // Listen to query execution updates from LiveQueryTesterCard
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

            {/* Collapsible Live Supabase Query Suite Banner (Cleaned for Team Lead preference) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
              <button
                onClick={() => setShowQuerySuite(!showQuerySuite)}
                className="w-full px-5 py-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-xs font-bold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                    <Database className="w-4 h-4" />
                  </div>
                  <span>Live Database Query Trigger Suite & Country Selector</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="text-[11px] font-medium text-slate-500">
                    {showQuerySuite ? 'Click to collapse triggers' : 'Click to expand query triggers'}
                  </span>
                  {showQuerySuite ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {showQuerySuite && (
                <div className="p-4 border-t border-slate-100">
                  <LiveQueryTesterCard />
                </div>
              )}
            </div>

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
