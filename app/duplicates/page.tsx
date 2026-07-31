'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CustomCountrySelect } from '@/components/dashboard/CustomCountrySelect';
import {
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Info,
  ShieldCheck,
  Trash2,
  FileCheck
} from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

export default function DuplicatesPage() {
  const [selectedCountry, setSelectedCountry] = useState('United States');

  // Exact USA Deduplication Report Data from user report
  const isUsa = selectedCountry === 'United States';

  const usaData = {
    totalRemoved: 42445,
    expectedTotal: 42449,
    pendingManualReview: 4,
    buckets: [
      {
        name: 'Bucket A — Safe Merges',
        description: 'Normalized Company Name + Root Domain exact identity match',
        removed: 13049,
        remaining: 0,
        status: 'Fully Cleared',
        color: 'emerald'
      },
      {
        name: 'Bucket B — Metadata Review',
        description: 'LinkedIn URL + Domain match with slight name variations',
        removed: 29295,
        remaining: 0,
        status: 'Fully Cleared',
        color: 'emerald'
      },
      {
        name: 'Bucket C — Higher-Risk Conflicts',
        description: 'Complex entity name conflicts or multiple location branches',
        removed: 101,
        remaining: 4,
        status: '4 Pairs Pending Review',
        color: 'amber'
      }
    ],
    relatedCompanyTables: [
      { table: 'project_companies', deleted: 10, note: 'Linked project assignments updated' },
      { table: 'enrichment_queue', deleted: 9, note: 'Pending queue items purged' },
      { table: 'user_enriched_companies', deleted: 3, note: 'User custom tags re-mapped' },
      { table: 'company_ir_data', deleted: 1, note: 'Investor relations record merged' }
    ]
  };

  return (
    <DashboardShell>
      {() => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6 pb-8"
        >
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <SectionHeader
              title="Country-Wise Duplicate Removal Report"
              description="Tracking exact-identity deduplication, record merges, and database table cleanups per country."
            />

            {/* Sleek Custom Country Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs font-bold text-slate-500 pl-1">Country:</span>
              <CustomCountrySelect
                value={selectedCountry}
                onChange={(c) => setSelectedCountry(c)}
              />
            </div>
          </div>

          {isUsa ? (
            <div className="space-y-6">
              {/* Top KPI Cards for USA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Removed Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Duplicates Removed</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {formatNumber(usaData.totalRemoved)}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Target expected total: <span className="font-bold text-slate-700 font-mono">{formatNumber(usaData.expectedTotal)}</span> records
                  </p>
                </div>

                {/* Cleared Buckets A & B */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Buckets A & B Status</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                    42,344 Cleared (100%)
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Safe merges and metadata review buckets fully cleared
                  </p>
                </div>

                {/* Pending Review Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Pending Manual Review</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-3xl font-extrabold text-amber-600 font-mono tracking-tight">
                    {usaData.pendingManualReview} <span className="text-xs font-normal text-slate-500">Pairs</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bucket C higher-risk entity conflicts awaiting final review
                  </p>
                </div>
              </div>

              {/* Bucket Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        USA Deduplication Buckets Breakdown
                      </h3>
                      <p className="text-xs text-slate-500">
                        Exact-identity cleanup based on normalized Company Name + Domain + LinkedIn
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" /> Buckets A & B 100% Cleared
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/50">
                        <th className="py-3 px-3 font-bold">Bucket Category</th>
                        <th className="py-3 px-3 font-bold">Matching Criteria</th>
                        <th className="py-3 px-3 text-right font-bold">Records Removed</th>
                        <th className="py-3 px-3 text-right font-bold">Remaining Duplicates</th>
                        <th className="py-3 px-3 text-center font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usaData.buckets.map((b) => (
                        <tr key={b.name} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-slate-900">{b.name}</td>
                          <td className="py-3.5 px-3 text-slate-600">{b.description}</td>
                          <td className="py-3.5 px-3 text-right font-mono font-extrabold text-blue-700">
                            {formatNumber(b.removed)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-700">
                            {b.remaining}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                b.remaining === 0
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {b.remaining === 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Related Company Tables Handled Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        Related Company Database Tables Handled
                      </h3>
                      <p className="text-xs text-slate-500">
                        Foreign key cascade deletions & record re-mappings completed during USA deduplication
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    Total Company Rows Deleted: 23
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {usaData.relatedCompanyTables.map((t) => (
                    <div key={t.table} className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                        <span className="truncate">{t.table}</span>
                        <span className="text-rose-600 flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> -{t.deleted}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{t.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Status Note */}
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-blue-950">Current Status Summary:</h4>
                  <p>
                    The US exact-identity cleanup based on normalized <strong>Company Name + Domain + LinkedIn</strong> is almost complete. Buckets A and B are fully cleared, while Bucket C has only 4 extra records remaining for final manual approval.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-soft">
              <Database className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-800">
                Deduplication Scan Pending for {selectedCountry}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Exact-identity duplicate removal reports are currently active for United States 🇺🇸. Deduplication scanning for {selectedCountry} is scheduled in upcoming database maintenance windows.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </DashboardShell>
  );
}
