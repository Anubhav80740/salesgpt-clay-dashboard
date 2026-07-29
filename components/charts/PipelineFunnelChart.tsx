'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PipelineStageRecord } from '@/types';
import { formatNumber, formatCompactNumber } from '@/utils/formatters';

interface PipelineFunnelChartProps {
  stages: PipelineStageRecord[];
}

export function PipelineFunnelChart({ stages }: PipelineFunnelChartProps) {
  const chartData = stages.map((s) => ({
    name: s.stageName,
    count: s.count,
    completionPct: s.completionPct,
    isFailed: s.stageName === 'Failed',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-800 space-y-1">
          <div className="font-semibold text-slate-100">{data.name}</div>
          <div className="text-slate-300">
            Records: <span className="text-white font-mono">{formatNumber(data.count)}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Retention Rate: <span className="text-emerald-400 font-semibold">{data.completionPct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-soft mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Pipeline Funnel & Conversion Drop-off</h2>
          <p className="text-xs text-slate-500 mt-0.5">Visual representation of record volume per ingestion stage</p>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#64748B' }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis
              tickFormatter={(val) => formatCompactNumber(val)}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isFailed ? '#DC2626' : '#2563EB'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
