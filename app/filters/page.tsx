'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { Sliders, RotateCcw, Filter, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { getFilterOptions, getOverviewMetrics } from '@/services/dashboard';
import { formatNumber } from '@/utils/formatters';

export default function FiltersPage() {
  const filterOptions = getFilterOptions();

  return (
    <DashboardShell>
      {({ filters, isRefreshing }) => {
        const metrics = getOverviewMetrics(filters);

        const activeCount = Object.entries(filters).filter(
          ([key, value]) => key !== 'dateRange' && key !== 'searchQuery' && value !== 'All'
        ).length;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <SectionHeader
              title="Global Data Filters & Presets"
              description="Configure multi-source data parameters, save preset filters, and inspect record retention ratios."
            />

            {/* Impact Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Active Filter Rules"
                value={`${activeCount} Active`}
                subtitle={activeCount === 0 ? 'Showing all records' : 'Filtering global dataset'}
                icon={Filter}
                iconColor="blue"
              />
              <StatCard
                title="Qualified SalesGPT Records"
                value={formatNumber(metrics.totalSalesGPT)}
                subtitle="Matching active filter criteria"
                icon={Building2}
                iconColor="green"
              />
              <StatCard
                title="Qualified Clay Net-New"
                value={formatNumber(metrics.clayOnlyNewCompanies)}
                subtitle="Ready for CRM enrichment"
                icon={Sparkles}
                iconColor="orange"
              />
            </div>

            {/* Filter Configuration Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-soft space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-salesgpt-600" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Filter Configuration Matrix</h2>
                    <p className="text-xs text-slate-500">Selections apply to Overview, Country, Duplicates, and Pipeline pages</p>
                  </div>
                </div>

                {activeCount > 0 && (
                  <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold border border-blue-200">
                    {activeCount} Active Filter Criteria
                  </span>
                )}
              </div>

              {/* Active Filter Matrix Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <label className="block font-bold text-slate-900 mb-1">Geographic Region</label>
                  <div className="font-medium text-slate-700">{filters.country}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Filter by ISO country code</span>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <label className="block font-bold text-slate-900 mb-1">Target Industry</label>
                  <div className="font-medium text-slate-700">{filters.industry}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">NAICS & custom taxonomy</span>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <label className="block font-bold text-slate-900 mb-1">Employee Size Range</label>
                  <div className="font-medium text-slate-700">{filters.employeeRange}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">LinkedIn headcount tier</span>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <label className="block font-bold text-slate-900 mb-1">Data Source Stream</label>
                  <div className="font-medium text-slate-700">{filters.dataSource}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Origin database pool</span>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <label className="block font-bold text-slate-900 mb-1">Pipeline Stage</label>
                  <div className="font-medium text-slate-700">{filters.pipelineStatus}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Ingestion stage volume</span>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <label className="block font-bold text-slate-900 mb-1">Duplicate Rule Type</label>
                  <div className="font-medium text-slate-700">{filters.duplicateType}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Deduplication algorithm</span>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <label className="block font-bold text-slate-900 mb-1">Field Quality Status</label>
                  <div className="font-medium text-slate-700">{filters.fieldIssue}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Schema discrepancy state</span>
                </div>

                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                  <label className="block font-bold text-slate-900 mb-1">Date Window</label>
                  <div className="font-medium text-slate-700">{filters.dateRange}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Reconciliation date range</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 flex items-start gap-3 text-xs text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">How Global Filters Work:</strong> Use the top Global Filter Drawer (accessible via the filter bar toggle on any page) to adjust criteria. All metrics, country comparison tables, deduplication charts, and pipeline stage counts update instantly.
                </div>
              </div>
            </div>
          </motion.div>
        );
      }}
    </DashboardShell>
  );
}
