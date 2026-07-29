'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Settings, Key, Sliders, Bell, Database, Check } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell>
      {() => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <SectionHeader
            title="Dashboard & Pipeline Settings"
            description="Manage data reconciliation confidence thresholds, API keys, and automated cleaning rules."
          />

          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 1: API Connections */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Key className="w-4 h-4 text-salesgpt-600" />
                <h2 className="text-base font-bold text-slate-900">API Credentials & Sync Endpoints</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    SalesGPT Internal API Key
                  </label>
                  <input
                    type="password"
                    defaultValue="sgpt_live_9f8d7c6b5a4e3f21"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Read/write access to main CRM database tables.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clay Webhook Endpoint URL
                  </label>
                  <input
                    type="text"
                    defaultValue="https://api.salesgpt.ai/v2/ingest/clay-stream"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Receives automated JSON webhook payloads from Clay.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Matching Confidence */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sliders className="w-4 h-4 text-clay-600" />
                <h2 className="text-base font-bold text-slate-900">Matching Confidence Thresholds</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Exact Domain Match Confidence
                    </label>
                    <span className="text-xs font-bold text-salesgpt-600 font-mono">95%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="100"
                    defaultValue="95"
                    className="w-full accent-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Automated merge trigger threshold for identical root domains.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Fuzzy Entity Match Confidence
                    </label>
                    <span className="text-xs font-bold text-amber-600 font-mono">82%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="95"
                    defaultValue="82"
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Flagged for manual review if confidence falls between 70%-82%.</p>
                </div>
              </div>
            </div>

            {/* Section 3: Save button */}
            <div className="flex items-center justify-end gap-3">
              {saved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Settings saved successfully
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-salesgpt-600 hover:bg-salesgpt-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </DashboardShell>
  );
}
