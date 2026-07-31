'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, Info, Clock } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { getCountryComparisonData } from '@/services/dashboard';
import { COUNTRY_CODES } from '@/components/dashboard/CustomCountrySelect';

interface WeeklyPoint {
  date: string;
  count: number;
}

export function WeeklyTechTrendChart() {
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [totalTechCompanies, setTotalTechCompanies] = useState<number>(0);
  const [trendData, setTrendData] = useState<WeeklyPoint[]>([]);
  const [topCountries, setTopCountries] = useState<any[]>([]);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/supabase-query-suite?cached=all', { cache: 'no-store' });
        const data = await res.json();
        const cachedQueries = data.success ? data.queries : {};

        // Calculate accurate total tech companies across the 13 target baseline countries
        const countriesData = getCountryComparisonData(undefined, cachedQueries);
        const totalSum = countriesData.reduce((acc, curr) => acc + (curr.salesgpt || 0), 0);
        setTotalTechCompanies(totalSum);

        // Top 5 Countries by Tech Company Count
        const sortedTop = [...countriesData]
          .sort((a, b) => b.salesgpt - a.salesgpt)
          .slice(0, 5);
        setTopCountries(sortedTop);

        // Set exact last updated timestamp
        if (data.lastUpdated) {
          const timeStr = new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastUpdatedTime(timeStr);
        } else {
          setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }

        const todayLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const points: WeeklyPoint[] = totalSum > 0
          ? [{ date: todayLabel, count: totalSum }]
          : [];

        setTrendData(points);
      } catch (e) {
        console.error('Error loading trend chart data:', e);
      }
      setLoading(false);
    }

    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('queryCacheUpdated', handleUpdate);
    return () => window.removeEventListener('queryCacheUpdated', handleUpdate);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Database Growth Area Chart (2 Cols) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4 flex flex-col justify-between">
        <div>
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Database Growth</h3>
              <p className="text-xs text-slate-500">Tech company records added over time</p>
            </div>

            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer transition-colors appearance-none"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Growth Total */}
          <div className="flex items-center gap-3 mt-4">
            <div className="text-xs font-medium text-slate-500">
              Total Tech Companies (13 Baseline Countries): <strong className="font-mono text-blue-600 font-extrabold text-base ml-1">{formatNumber(totalTechCompanies)}</strong>
            </div>
          </div>
        </div>

        {/* Recharts Area Curve */}
        <div className="h-52 w-full pt-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading trend...</div>
          ) : trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const point = payload[0].payload as WeeklyPoint;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl font-mono">
                          <div className="text-slate-400 text-[10px]">{point.date}</div>
                          <div className="font-bold text-blue-400 text-sm mt-0.5">{formatNumber(point.count)} Companies</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#growthAreaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 space-y-1">
              <Info className="w-4 h-4 text-slate-400" />
              <span>No tech company query snapshots recorded yet.</span>
            </div>
          )}
        </div>
      </div>

      {/* Top Countries by Tech Company Count (1 Col) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Top Countries — Tech Companies</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </h3>
              <p className="text-[11px] text-slate-500">Live database count by region</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {topCountries.map((item, idx) => {
              const countryCode = COUNTRY_CODES[item.country];
              return (
                <div key={item.country} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold text-slate-400 w-3">{idx + 1}</span>
                    {countryCode ? (
                      <img
                        src={`https://flagcdn.com/w40/${countryCode}.png`}
                        alt={item.country}
                        className="w-4 h-3 object-cover rounded-2xs border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <span className="w-4 text-center">🌐</span>
                    )}
                    <span className="font-bold text-slate-800">{item.country}</span>
                  </div>

                  <span className="font-extrabold text-slate-900 font-mono">
                    {item.salesgpt > 0 ? formatNumber(item.salesgpt) : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Last Updated:
          </span>
          <span className="font-mono text-slate-700 font-semibold">{lastUpdatedTime || 'Today'}</span>
        </div>
      </div>
    </div>
  );
}
