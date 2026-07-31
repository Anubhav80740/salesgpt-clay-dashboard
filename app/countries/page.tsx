'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { CountryTable } from '@/components/tables/CountryTable';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { TableSkeleton } from '@/components/cards/LoadingSkeleton';
import { getCountryComparisonData } from '@/services/dashboard';
import { Globe, Info, Zap } from 'lucide-react';

export default function CountryComparisonPage() {
  const [cachedQueries, setCachedQueries] = React.useState<Record<string, Record<string, { count: number }>>>({});

  const reloadCache = React.useCallback(async () => {
    try {
      const res = await fetch('/api/supabase-query-suite?cached=all', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.queries) {
        setCachedQueries(data.queries);
      }
    } catch (e) {
      console.error('Failed to load live query cache on countries page:', e);
    }
  }, []);

  React.useEffect(() => {
    reloadCache();
    const handleUpdate = () => reloadCache();
    window.addEventListener('queryCacheUpdated', handleUpdate);
    return () => window.removeEventListener('queryCacheUpdated', handleUpdate);
  }, [reloadCache]);

  return (
    <DashboardShell>
      {({ filters, isRefreshing }) => {
        const countryData = getCountryComparisonData(filters, cachedQueries);

        if (isRefreshing) {
          return (
            <div className="space-y-6">
              <TableSkeleton rows={8} />
            </div>
          );
        }

        const excellentCount = countryData.filter((c) => c.status === 'Excellent').length;
        const needsAttentionCount = countryData.filter((c) => c.status === 'Needs Attention' || c.status === 'Poor').length;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <SectionHeader
              title="Country Coverage Comparison (Tech Companies)"
              description="Granular evaluation of Tech Companies density and overlap across geographic regions using live database queries."
            />

            {/* Quick summary alert bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Tracking <strong className="font-semibold text-slate-900">{countryData.length} active regions</strong>. Data under <span className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-bold">SalesGPT</span> reflects live queried Tech Companies count.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" /> Live Synced
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">
                  {excellentCount} Excellent Regions
                </span>
                <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md font-semibold">
                  {needsAttentionCount} Need Attention
                </span>
              </div>
            </div>

            {/* Country Table Component */}
            <CountryTable data={countryData} />
          </motion.div>
        );
      }}
    </DashboardShell>
  );
}
