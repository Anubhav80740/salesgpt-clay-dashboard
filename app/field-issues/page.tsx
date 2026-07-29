'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { IssueTable } from '@/components/tables/IssueTable';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CardSkeleton, TableSkeleton } from '@/components/cards/LoadingSkeleton';
import { getFieldIssuesData } from '@/services/dashboard';
import { formatNumber } from '@/utils/formatters';
import { AlertTriangle, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

export default function FieldIssuesPage() {
  return (
    <DashboardShell>
      {({ filters, isRefreshing }) => {
        const { overview, issues } = getFieldIssuesData(filters);

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
              title="Field-Level Data Quality & Discrepancies"
              description="Audit log of field schema mismatches, missing attributes, and suggested remediation rules."
            />

            {/* Top 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Fields with Issues"
                value={formatNumber(overview.fieldsWithIssues)}
                subtitle="Attributes flagged during validation"
                icon={AlertTriangle}
                iconColor="red"
              />
              <StatCard
                title="Pending"
                value={formatNumber(overview.pendingCount)}
                subtitle="Awaiting automated or manual fix"
                icon={Clock}
                iconColor="orange"
              />
              <StatCard
                title="In Review / Cleaning"
                value={formatNumber(overview.inReviewCount)}
                subtitle="Transformations currently running"
                icon={RefreshCw}
                iconColor="blue"
              />
              <StatCard
                title="Resolved"
                value={formatNumber(overview.resolvedCount)}
                subtitle="Schemas successfully normalized"
                icon={CheckCircle2}
                iconColor="green"
              />
            </div>

            {/* Detailed Table */}
            <IssueTable data={issues} />
          </motion.div>
        );
      }}
    </DashboardShell>
  );
}
