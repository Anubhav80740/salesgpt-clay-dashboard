'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  Laptop,
  Briefcase,
  Users,
  UserCheck,
  UserX,
  Code2,
  Zap,
  Globe,
  HardDrive,
} from 'lucide-react';
import { fetchQuerySuiteCountFromSupabase, fetchCachedQuerySuiteFromSupabase } from '@/services/dashboard';
import { formatNumber } from '@/utils/formatters';

interface QueryItem {
  key: string;
  title: string;
  unit: string;
  description: string;
  icon: React.ElementType;
  color: string;
  getSql: (country: string) => string;
}

export const COUNTRY_CODES: Record<string, string> = {
  'United States': 'us',
  'Canada': 'ca',
  'United Kingdom': 'gb',
  'Germany': 'de',
  'France': 'fr',
  'Australia': 'au',
  'India': 'in',
  'Japan': 'jp',
  'Brazil': 'br',
  'Mexico': 'mx',
  'Netherlands': 'nl',
  'Spain': 'es',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Italy': 'it',
  'Ireland': 'ie',
  'Israel': 'il',
  'Singapore': 'sg',
  'Romania': 'ro',
  'Argentina': 'ar',
  'Belgium': 'be',
  'Austria': 'at',
  'Denmark': 'dk',
  'Finland': 'fi',
  'Norway': 'no',
  'Poland': 'pl',
  'Portugal': 'pt',
  'South Africa': 'za',
  'South Korea': 'kr',
  'New Zealand': 'nz',
  'United Arab Emirates': 'ae',
};

const COUNTRY_OPTIONS = Object.keys(COUNTRY_CODES);

const QUERIES: QueryItem[] = [
  {
    key: 'total_companies',
    title: 'Total Companies',
    unit: 'Companies',
    description: 'Count of all companies in selected country',
    icon: Building2,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    getSql: (c) => `SELECT COUNT(*) AS total_companies
FROM company_master
WHERE (
  TRIM(LOWER(country)) = '${c.toLowerCase()}'
  OR country ILIKE '${c}'
);`,
  },
  {
    key: 'tech_companies',
    title: 'Tech Companies',
    unit: 'Tech Companies',
    description: 'Count of tech companies matched by primary industry array',
    icon: Laptop,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    getSql: (c) => `SELECT COUNT(*) AS tech_companies
FROM company_master
WHERE (
  TRIM(LOWER(country)) = '${c.toLowerCase()}'
  OR country ILIKE '${c}'
)
AND primary_industry ILIKE ANY (ARRAY[
    '%software%', '%technology%', '%information%', '%internet%', '%computer%',
    '%data%', '%IT%', '%telecom%', '%electronics%', '%semiconductor%',
    '%automation%', '%robotics%', '%network%', '%blockchain%', '%cyber%', '%cloud%'
]);`,
  },
  {
    key: 'non_tech_companies',
    title: 'Non-Tech Companies',
    unit: 'Non-Tech Companies',
    description: 'Count of non-tech companies outside tech industry list',
    icon: Briefcase,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    getSql: (c) => `SELECT COUNT(*) AS non_tech_companies
FROM company_master
WHERE (
  TRIM(LOWER(country)) = '${c.toLowerCase()}'
  OR country ILIKE '${c}'
)
AND NOT (primary_industry ILIKE ANY (ARRAY[
    '%software%', '%technology%', '%information%', '%internet%', '%computer%',
    '%data%', '%IT%', '%telecom%', '%electronics%', '%semiconductor%',
    '%automation%', '%robotics%', '%network%', '%blockchain%', '%cyber%', '%cloud%'
]));`,
  },
  {
    key: 'tech_employee_headcount',
    title: 'Total Employees in Tech (Headcount)',
    unit: 'Employees',
    description: 'Sum of employee headcount for tech companies in country',
    icon: Users,
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    getSql: (c) => `SELECT SUM(employee_count) AS total_tech_employee_headcount
FROM company_master
WHERE (
  TRIM(LOWER(country)) = '${c.toLowerCase()}'
  OR country ILIKE '${c}'
)
AND employee_count IS NOT NULL
AND primary_industry ILIKE ANY (ARRAY[
    '%software%', '%technology%', '%information%', '%internet%', '%computer%',
    '%data%', '%IT%', '%telecom%', '%electronics%', '%semiconductor%',
    '%automation%', '%robotics%', '%network%', '%blockchain%', '%cyber%', '%cloud%'
]);`,
  },
  {
    key: 'non_tech_employee_headcount',
    title: 'Total Employees in Non-Tech (Headcount)',
    unit: 'Employees',
    description: 'Sum of employee headcount for non-tech companies in country',
    icon: UserCheck,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    getSql: (c) => `SELECT COALESCE(SUM(employee_count), 0) AS total_non_tech_employee_headcount
FROM company_master
WHERE (
  TRIM(LOWER(country)) = '${c.toLowerCase()}'
  OR country ILIKE '${c}'
)
AND employee_count IS NOT NULL AND employee_count > 0
AND NOT (primary_industry ILIKE ANY (ARRAY[
    '%software%', '%technology%', '%information%', '%internet%', '%computer%',
    '%data%', '%IT%', '%telecom%', '%electronics%', '%semiconductor%',
    '%automation%', '%robotics%', '%network%', '%blockchain%', '%cyber%', '%cloud%'
]));`,
  },
  {
    key: 'zero_employees',
    title: 'Companies with 0 or Null Employees',
    unit: 'Companies',
    description: 'Count of companies where employee count is 0 or null',
    icon: UserX,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
    getSql: (c) => `SELECT COUNT(*) AS companies_with_no_employees
FROM company_master
WHERE (
  TRIM(LOWER(country)) = '${c.toLowerCase()}'
  OR country ILIKE '${c}'
)
AND (employee_count IS NULL OR employee_count = 0);`,
  },
];

export function LiveQueryTesterCard() {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [loadingState, setLoadingState] = useState<Record<string, boolean>>({});
  const [isDailyScanning, setIsDailyScanning] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});
  const [historyCounts, setHistoryCounts] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [executedAt, setExecutedAt] = useState<Record<string, string>>({});
  const [isCached, setIsCached] = useState<Record<string, boolean>>({});
  const [showSql, setShowSql] = useState<Record<string, boolean>>({});

  // Load stored cache on mount & country change
  const loadCache = React.useCallback(async () => {
    let newResults: Record<string, number> = {};
    let newExecutedAt: Record<string, string> = {};
    let newHistoryCounts: Record<string, number> = {};
    let newIsCached: Record<string, boolean> = {};

    // 1. Read browser localStorage first
    const localKey = `queryCache_${selectedCountry}`;
    if (typeof window !== 'undefined') {
      const savedLocal = localStorage.getItem(localKey);
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          Object.keys(parsed).forEach((key) => {
            newResults[key] = parsed[key].count;
            newExecutedAt[key] = parsed[key].executedAt;
            newIsCached[key] = true;
          });
        } catch (e) {}
      }
    }

    // 2. Read server disk JSON cache (data/liveQueryCache.json)
    const diskCached = await fetchCachedQuerySuiteFromSupabase(selectedCountry);
    if (diskCached && Object.keys(diskCached).length > 0) {
      Object.keys(diskCached).forEach((key) => {
        const item = diskCached[key] as any;
        const val = item?.latest?.count ?? item?.count;
        const time = item?.latest?.executedAt ?? item?.executedAt;
        const histCount = Array.isArray(item?.history) ? item.history.length : (val !== undefined ? 1 : 0);

        if (val !== undefined) {
          newResults[key] = val;
          newExecutedAt[key] = time;
          newHistoryCounts[key] = histCount;
          newIsCached[key] = true;
        }
      });
    }

    setResults(newResults);
    setExecutedAt(newExecutedAt);
    setHistoryCounts(newHistoryCounts);
    setIsCached(newIsCached);
    setErrors({});
  }, [selectedCountry]);

  useEffect(() => {
    loadCache();
  }, [loadCache]);

  const handleTriggerQuery = async (queryKey: string) => {
    setLoadingState((prev) => ({ ...prev, [queryKey]: true }));
    setErrors((prev) => ({ ...prev, [queryKey]: '' }));

    const { count, error } = await fetchQuerySuiteCountFromSupabase(queryKey, selectedCountry);

    if (error) {
      setErrors((prev) => ({ ...prev, [queryKey]: error }));
    } else {
      const timeStr = new Date().toLocaleTimeString();
      setResults((prev) => ({ ...prev, [queryKey]: count }));
      setExecutedAt((prev) => ({ ...prev, [queryKey]: timeStr }));
      setIsCached((prev) => ({ ...prev, [queryKey]: false }));
      setHistoryCounts((prev) => ({ ...prev, [queryKey]: (prev[queryKey] || 0) + 1 }));

      // Save to browser localStorage
      if (typeof window !== 'undefined') {
        const localKey = `queryCache_${selectedCountry}`;
        const savedLocal = localStorage.getItem(localKey);
        const parsed = savedLocal ? JSON.parse(savedLocal) : {};
        parsed[queryKey] = { count, executedAt: timeStr };
        localStorage.setItem(localKey, JSON.stringify(parsed));

        // Notify dashboard components (Coverage table, KPI cards) to re-render immediately
        window.dispatchEvent(new CustomEvent('queryCacheUpdated'));
      }
    }

    setLoadingState((prev) => ({ ...prev, [queryKey]: false }));
  };

  const handleTriggerAll = async () => {
    QUERIES.forEach((q) => handleTriggerQuery(q.key));
  };

  const handleRunDailyScan = async () => {
    setIsDailyScanning(true);
    try {
      const res = await fetch('/api/supabase-query-suite?action=run_daily_scan', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        await loadCache();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('queryCacheUpdated'));
        }
      }
    } catch (e) {
      console.error('Daily scan failed:', e);
    }
    setIsDailyScanning(false);
  };

  const toggleSql = (key: string) => {
    setShowSql((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAnyLoading = Object.values(loadingState).some(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>Live Supabase Database Query Suite</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> Auto-Saved JSON Cache
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Target Table: <code className="font-mono text-blue-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded">company_master</code> | File: <code className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">data/liveQueryCache.json</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Country Selector Dropdown with Flag Image */}
          <div className="relative flex items-center">
            {COUNTRY_CODES[selectedCountry] && (
              <img
                src={`https://flagcdn.com/w40/${COUNTRY_CODES[selectedCountry]}.png`}
                alt={selectedCountry}
                className="w-5 h-3.5 object-cover rounded-2xs absolute left-3 pointer-events-none border border-slate-200/80 shadow-xs"
              />
            )}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs transition-colors"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTriggerAll}
            disabled={isAnyLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0"
          >
            {isAnyLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Queries...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>Trigger {selectedCountry} Queries</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of 6 Query Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUERIES.map((q) => {
          const Icon = q.icon;
          const isLoading = loadingState[q.key];
          const countResult = results[q.key];
          const err = errors[q.key];
          const time = executedAt[q.key];
          const cachedFlag = isCached[q.key];
          const isSqlVisible = showSql[q.key];
          const sqlSnippet = q.getSql(selectedCountry);

          return (
            <div
              key={q.key}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between space-y-3.5 hover:border-slate-300 transition-all"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg border ${q.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">{q.title}</h3>
                  </div>

                  <button
                    onClick={() => toggleSql(q.key)}
                    title="View SQL Query"
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      isSqlVisible
                        ? 'bg-slate-800 text-slate-200 border-slate-700'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {q.description} ({selectedCountry})
                </p>
              </div>

              {/* SQL Code Preview (Toggleable) */}
              {isSqlVisible && (
                <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-[10px] font-mono leading-relaxed overflow-x-auto border border-slate-800 whitespace-pre-wrap max-h-36 overflow-y-auto scrollbar-thin">
                  {sqlSnippet}
                </div>
              )}

              {/* Result Display Box */}
              {countResult !== undefined && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate font-semibold">
                      Count: <strong className="font-extrabold text-slate-900 text-xs ml-1">{formatNumber(countResult)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-emerald-700 font-mono shrink-0">
                    {cachedFlag && <span className="px-1.5 py-0.5 rounded bg-emerald-100 font-bold">Stored</span>}
                    <span>{time}</span>
                  </div>
                </div>
              )}

              {err && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-[11px] text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 text-clip overflow-hidden" />
                  <span className="truncate">{err}</span>
                </div>
              )}

              {/* Trigger Button */}
              <button
                onClick={() => handleTriggerQuery(q.key)}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 active:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Executing Query...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current text-blue-600" />
                    <span>{countResult !== undefined ? 'Re-Trigger Query' : 'Trigger Query'}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
