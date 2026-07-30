'use client';

import React, { useState } from 'react';
import { Database, Play, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchUSCompanyCountFromSupabase } from '@/services/dashboard';
import { formatNumber } from '@/utils/formatters';

export function LiveQueryTesterCard() {
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [executedAt, setExecutedAt] = useState<string | null>(null);

  const handleExecuteQuery = async () => {
    setLoading(true);
    setErrorMessage(null);

    const { count, error } = await fetchUSCompanyCountFromSupabase();

    if (error) {
      setErrorMessage(error);
      setResultCount(null);
    } else {
      setResultCount(count);
      setExecutedAt(new Date().toLocaleTimeString());
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Supabase Tech Companies Query Tester</h3>
            <p className="text-[11px] text-slate-500">
              Target: <code className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-100">company_master</code> (US Tech Filter)
            </p>
          </div>
        </div>

        <button
          onClick={handleExecuteQuery}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Trigger Query</span>
            </>
          )}
        </button>
      </div>

      {/* SQL Snippet Preview */}
      <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] font-mono leading-relaxed overflow-x-auto border border-slate-800 whitespace-pre-wrap">
        <span className="text-blue-400">SELECT</span> <span className="text-emerald-400">COUNT(*)</span> <span className="text-blue-400">AS</span> tech_companies <span className="text-blue-400">FROM</span> company_master{'\n'}
        <span className="text-blue-400">WHERE</span> TRIM(LOWER(country)) <span className="text-blue-400">IN</span> (<span className="text-amber-300">'united states', 'us', 'usa', 'united states of america', 'u.s.', 'u.s.a.'</span>){'\n'}
        <span className="text-blue-400">AND</span> primary_industry <span className="text-blue-400">ILIKE ANY</span> (ARRAY[<span className="text-amber-300">'%software%', '%technology%', '%information%', '%internet%', '%computer%', '%data%', '%IT%', '%telecom%', '%electronics%', '%cloud%', ...</span>]);
      </div>

      {/* Results Display */}
      {resultCount !== null && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Query Returned: <strong className="font-extrabold text-slate-900 text-sm ml-1">{formatNumber(resultCount)}</strong> US Tech Companies</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Executed at {executedAt}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Database Query Error: {errorMessage}</span>
        </div>
      )}
    </div>
  );
}
