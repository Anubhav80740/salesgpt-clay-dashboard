'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DuplicateTypeRecord } from '@/types';
import { formatNumber } from '@/utils/formatters';
import { Info } from 'lucide-react';

interface DuplicatePieChartProps {
  data: DuplicateTypeRecord[];
  totalRemoved: number;
}

export function DuplicatePieChart({ data, totalRemoved }: DuplicatePieChartProps) {
  const chartData = data.map((item) => ({
    name: item.duplicateType,
    value: item.rowsRemoved,
    color: item.color,
    percentage: item.percentage,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            Duplicates Summary (Clay Data)
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 mt-4">
          {/* Donut Chart with center text */}
          <div className="sm:col-span-6 relative h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatNumber(value), 'Rows Removed']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Donut Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-blue-600 tracking-tight font-mono">
                {formatNumber(totalRemoved)}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight">
                Total Duplicates<br />Removed
              </span>
            </div>
          </div>

          {/* Right side legend matching screenshot */}
          <div className="sm:col-span-6 space-y-2.5 text-xs pr-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium truncate text-[11px]">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono text-[11px] shrink-0">
                  {formatNumber(item.value)} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
        Duplicates removed before comparison.
      </div>
    </div>
  );
}
