'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { CountryTable } from '@/components/tables/CountryTable';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { TableSkeleton } from '@/components/cards/LoadingSkeleton';
import { getCountryComparisonData } from '@/services/dashboard';
import { Globe, Info } from 'lucide-react';

export default function CountryComparisonPage() {
  return (
    <DashboardShell>
      {({ filters, isRefreshing }) => {
        const countryData = getCountryComparisonData(filters);

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
              title="Country Coverage Comparison"
              description="Granular evaluation of company data density and overlap across geographic regions."
            />

            {/* Quick summary alert bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Globe className="w-4 h-4 text-salesgpt-600 shrink-0" />
                <span>
                  Tracking <strong className="font-semibold text-slate-900">{countryData.length} active regions</strong>. Coverage ratio defined as <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono">Overlap / Clay Clean</code>.
                </span>
              </div>

              <div className="flex items-center gap-3">
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
