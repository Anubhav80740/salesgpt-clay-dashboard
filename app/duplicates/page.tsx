'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { DuplicatePieChart } from '@/components/charts/DuplicatePieChart';
import { DuplicateTable } from '@/components/tables/DuplicateTable';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CardSkeleton, TableSkeleton } from '@/components/cards/LoadingSkeleton';
import { getDuplicatesData } from '@/services/dashboard';
import { formatNumber } from '@/utils/formatters';
import { CopyX, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function DuplicatesPage() {
  return (
    <DashboardShell>
      {({ filters, isRefreshing }) => {
        const { overview, types } = getDuplicatesData(filters);

        if (isRefreshing) {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
              <TableSkeleton rows={6} />
            </div>
          );
        }

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <SectionHeader
              title="Duplicate Data Analysis"
              description="Deduplication statistics, fuzzy match categorization, and manual review queue status."
            />

            {/* Top 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Duplicate Groups"
                value={formatNumber(overview.duplicateGroups)}
                subtitle="Unique duplicate clusters identified"
                icon={CopyX}
                iconColor="orange"
              />
              <StatCard
                title="Duplicate Rows Removed"
                value={formatNumber(overview.duplicateRowsRemoved)}
                subtitle="Redundant records purged from stream"
                icon={Trash2}
                iconColor="red"
              />
              <StatCard
                title="Manual Review Needed"
                value={formatNumber(overview.manualReviewNeeded)}
                subtitle="Fuzzy matches awaiting analyst confirmation"
                icon={ShieldAlert}
                iconColor="orange"
              />
              <StatCard
                title="Confirmed Matches"
                value={formatNumber(overview.confirmedMatches)}
                subtitle="High-confidence automated merges"
                icon={CheckCircle2}
                iconColor="green"
              />
            </div>

            {/* Middle: Pie Chart */}
            <DuplicatePieChart data={types} totalRemoved={overview.duplicateRowsRemoved} />

            {/* Bottom: Table */}
            <DuplicateTable data={types} />
          </motion.div>
        );
      }}
    </DashboardShell>
  );
}
