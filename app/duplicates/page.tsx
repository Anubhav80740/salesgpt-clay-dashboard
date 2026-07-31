'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { COUNTRY_CODES } from '@/components/dashboard/CustomCountrySelect';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Database,
  Trash2,
  Info,
  Globe
} from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

export default function DuplicatesPage() {
  // All countries deduplication data rendered directly on screen (NO dropdown click needed)
  const countryDeduplicationList = [
    { country: 'United States', removed: 42445, expected: 42449, pending: 4, status: 'Completed (4 Pending Review)' },
    { country: 'Canada', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'United Kingdom', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'Germany', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'France', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'Australia', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'India', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'Japan', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'Brazil', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'Mexico', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'Netherlands', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'Singapore', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
    { country: 'United Arab Emirates', removed: 0, expected: 0, pending: 0, status: 'Scan Pending' },
  ];

  const totalGlobalDuplicatesRemoved = countryDeduplicationList.reduce((acc, c) => acc + c.removed, 0);

  return (
    <DashboardShell>
      {() => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6 pb-8"
        >
          {/* Header */}
          <SectionHeader
            title="Company Data Deduplication Report"
            description="Overall duplicate company records removed across target database countries."
          />

          {/* Row 1: Single Main Stat Card — Total Duplicates Removed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Single Main Hero Stat Card */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Total Duplicate Company Records Removed</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight mt-2">
                  {formatNumber(totalGlobalDuplicatesRemoved)}
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Exact-identity duplicates cleared based on normalized <strong className="text-slate-800">Company Name + Domain + LinkedIn URL</strong>. Expected total after final review: <strong className="font-mono text-slate-800">42,449</strong> records.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> US Dataset Cleared
                </span>
                <span className="font-mono font-bold text-amber-600">4 Pairs Pending Review</span>
              </div>
            </div>

            {/* Related Database Tables Cleaned Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase">Related Tables Cleaned</h3>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">23 Rows</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-medium">project_companies</span>
                  <span className="text-rose-600 font-bold flex items-center gap-1"><Trash2 className="w-3 h-3" /> -10</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-medium">enrichment_queue</span>
                  <span className="text-rose-600 font-bold flex items-center gap-1"><Trash2 className="w-3 h-3" /> -9</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-medium">user_enriched_companies</span>
                  <span className="text-rose-600 font-bold flex items-center gap-1"><Trash2 className="w-3 h-3" /> -3</span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-700 font-medium">company_ir_data</span>
                  <span className="text-rose-600 font-bold flex items-center gap-1"><Trash2 className="w-3 h-3" /> -1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: All Countries Duplicate Summary Table (Directly visible, NO dropdown click needed!) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Country-Wise Duplicates Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct view of duplicate company records removed across all regions
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">Showing 13 Target Countries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 font-bold">Country</th>
                    <th className="py-3 px-4 text-right font-bold">Duplicates Removed</th>
                    <th className="py-3 px-4 text-right font-bold">Expected Total</th>
                    <th className="py-3 px-4 text-right font-bold">Pending Review</th>
                    <th className="py-3 px-4 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {countryDeduplicationList.map((item) => {
                    const code = COUNTRY_CODES[item.country];
                    return (
                      <tr key={item.country} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          {code ? (
                            <img
                              src={`https://flagcdn.com/w40/${code}.png`}
                              alt={item.country}
                              className="w-4 h-3 object-cover rounded-2xs border border-slate-200 shadow-xs"
                            />
                          ) : (
                            <span>🌐</span>
                          )}
                          <span>{item.country}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-blue-700">
                          {item.removed > 0 ? formatNumber(item.removed) : '0'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">
                          {item.expected > 0 ? formatNumber(item.expected) : '0'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                          {item.pending > 0 ? item.pending : '0'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              item.removed > 0
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {item.removed > 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3 text-slate-400" />}
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Current Status Note */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-blue-950">US Deduplication Summary:</h4>
              <p className="mt-0.5">
                A total of <strong>42,445 duplicate company records</strong> have been cleared from the US dataset. 4 duplicate pairs remain for final manual review.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardShell>
  );
}
