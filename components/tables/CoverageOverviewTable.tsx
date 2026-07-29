import React from 'react';
import { CountryComparisonRecord } from '@/types';
import { formatNumber } from '@/utils/formatters';
import { Info } from 'lucide-react';

interface CoverageOverviewTableProps {
  data: CountryComparisonRecord[];
}

export function CoverageOverviewTable({ data }: CoverageOverviewTableProps) {
  const totalSalesGPT = data.reduce((acc, c) => acc + c.salesgpt, 0);
  const totalClayClean = data.reduce((acc, c) => acc + c.clayClean, 0);
  const totalOverlap = data.reduce((acc, c) => acc + c.overlap, 0);
  const totalClayOnly = data.reduce((acc, c) => acc + c.clayOnly, 0);
  const totalSalesGPTOnly = data.reduce((acc, c) => acc + c.salesgptOnly, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            Coverage by Country (Tech Companies)
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2 px-2">Country</th>
                <th className="py-2 px-2 text-right text-blue-600" colSpan={2}>
                  SalesGPT
                </th>
                <th className="py-2 px-2 text-right text-emerald-600" colSpan={2}>
                  Clay (Deduped)
                </th>
                <th className="py-2 px-2 text-right text-indigo-600" colSpan={2}>
                  Overlap
                </th>
                <th className="py-2 px-2 text-right">Clay Only</th>
                <th className="py-2 px-2 text-right">SalesGPT Only</th>
              </tr>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-medium uppercase">
                <th className="py-1 px-2"></th>
                <th className="py-1 px-1 text-right">Companies</th>
                <th className="py-1 px-1 text-right">%</th>
                <th className="py-1 px-1 text-right">Companies</th>
                <th className="py-1 px-1 text-right">%</th>
                <th className="py-1 px-1 text-right">Companies</th>
                <th className="py-1 px-1 text-right">%</th>
                <th className="py-1 px-2 text-right">Companies</th>
                <th className="py-1 px-2 text-right">Companies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-2 font-medium text-slate-900">{row.country}</td>
                  <td className="py-2 px-1 text-right font-mono text-slate-800">
                    {row.salesgpt > 0 ? formatNumber(row.salesgpt) : '-'}
                  </td>
                  <td className="py-2 px-1 text-right font-mono text-slate-500">
                    {row.salesgptPct ? `${row.salesgptPct}%` : '-'}
                  </td>
                  <td className="py-2 px-1 text-right font-mono text-slate-800 font-medium">
                    {formatNumber(row.clayClean)}
                  </td>
                  <td className="py-2 px-1 text-right font-mono text-slate-500">
                    {row.clayPct}%
                  </td>
                  <td className="py-2 px-1 text-right font-mono text-indigo-600 font-medium">
                    {row.overlap > 0 ? formatNumber(row.overlap) : '-'}
                  </td>
                  <td className="py-2 px-1 text-right font-mono text-slate-500">
                    {row.overlapPct ? `${row.overlapPct}%` : '-'}
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-emerald-600">
                    {formatNumber(row.clayOnly)}
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-slate-600">
                    {row.salesgptOnly > 0 ? formatNumber(row.salesgptOnly) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-300 font-bold text-slate-900 bg-slate-50/50">
                <td className="py-2.5 px-2">Total</td>
                <td className="py-2.5 px-1 text-right font-mono">{formatNumber(totalSalesGPT)}</td>
                <td className="py-2.5 px-1 text-right font-mono">100%</td>
                <td className="py-2.5 px-1 text-right font-mono">{formatNumber(totalClayClean)}</td>
                <td className="py-2.5 px-1 text-right font-mono">100%</td>
                <td className="py-2.5 px-1 text-right font-mono text-indigo-700">{formatNumber(totalOverlap)}</td>
                <td className="py-2.5 px-1 text-right font-mono">100%</td>
                <td className="py-2.5 px-2 text-right font-mono text-emerald-700">{formatNumber(totalClayOnly)}</td>
                <td className="py-2.5 px-2 text-right font-mono">{formatNumber(totalSalesGPTOnly)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
