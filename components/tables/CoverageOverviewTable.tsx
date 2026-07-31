import React from 'react';
import { CountryComparisonRecord } from '@/types';
import { formatNumber } from '@/utils/formatters';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { COUNTRY_CODES } from '@/components/dashboard/CustomCountrySelect';

interface CoverageOverviewTableProps {
  data: CountryComparisonRecord[];
}

export function CoverageOverviewTable({ data }: CoverageOverviewTableProps) {
  const totalSalesGPT = data.reduce((acc, c) => acc + (c.salesgpt || 0), 0);
  const totalClayClean = data.reduce((acc, c) => acc + (c.clayClean || 0), 0);
  const totalOverlap = data.reduce((acc, c) => acc + (c.overlap || 0), 0);
  const totalClayOnly = data.reduce((acc, c) => acc + (c.clayOnly || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Coverage by Country (Tech Companies)
          </h3>
          <p className="text-xs text-slate-500">
            Comparing SalesGPT live queried database records against baseline Clay dataset
          </p>
        </div>
        <Link
          href="/countries"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
        >
          <span>View All Countries</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/50">
              <th className="py-2.5 px-2 font-bold">Country</th>
              <th className="py-2.5 px-2 text-right text-blue-600 font-bold" colSpan={2}>
                SalesGPT (Tech)
              </th>
              <th className="py-2.5 px-2 text-right text-emerald-600 font-bold" colSpan={2}>
                Clay Dataset
              </th>
              <th className="py-2.5 px-2 text-right text-indigo-600 font-bold" colSpan={2}>
                Overlap
              </th>
              <th className="py-2.5 px-2 text-right text-amber-600 font-bold">Clay Only</th>
            </tr>
            <tr className="border-b border-slate-100 text-[9px] text-slate-400 font-mono bg-slate-50/30">
              <th></th>
              <th className="py-1 px-1 text-right">Companies</th>
              <th className="py-1 px-1 text-right">%</th>
              <th className="py-1 px-1 text-right">Companies</th>
              <th className="py-1 px-1 text-right">%</th>
              <th className="py-1 px-1 text-right">Companies</th>
              <th className="py-1 px-1 text-right">%</th>
              <th className="py-1 px-2 text-right">Companies</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => {
              const code = COUNTRY_CODES[row.country];
              return (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-2 font-bold text-slate-900 flex items-center gap-2">
                    {code ? (
                      <img
                        src={`https://flagcdn.com/w40/${code}.png`}
                        alt={row.country}
                        className="w-4 h-3 object-cover rounded-2xs border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <span>🌐</span>
                    )}
                    <span>{row.country}</span>
                  </td>
                  <td className="py-2.5 px-1 text-right font-mono text-slate-800">
                    {row.salesgpt > 0 ? formatNumber(row.salesgpt) : '-'}
                  </td>
                  <td className="py-2.5 px-1 text-right font-mono text-slate-500">
                    {row.salesgptPct ? `${row.salesgptPct}%` : '-'}
                  </td>
                  <td className="py-2.5 px-1 text-right font-mono text-slate-800 font-medium">
                    {formatNumber(row.clayClean)}
                  </td>
                  <td className="py-2.5 px-1 text-right font-mono text-slate-500">
                    {row.clayPct}%
                  </td>
                  <td className="py-2.5 px-1 text-right font-mono text-slate-400 font-medium">
                    -
                  </td>
                  <td className="py-2.5 px-1 text-right font-mono text-slate-400">
                    -
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-emerald-600">
                    {formatNumber(row.clayOnly)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-300 font-extrabold text-slate-900 bg-slate-50/50">
              <td className="py-2.5 px-2">Total</td>
              <td className="py-2.5 px-1 text-right font-mono text-blue-700">{formatNumber(totalSalesGPT)}</td>
              <td className="py-2.5 px-1 text-right font-mono text-slate-400">-</td>
              <td className="py-2.5 px-1 text-right font-mono text-emerald-700">{formatNumber(totalClayClean)}</td>
              <td className="py-2.5 px-1 text-right font-mono text-slate-400">-</td>
              <td className="py-2.5 px-1 text-right font-mono text-indigo-700">{formatNumber(totalOverlap)}</td>
              <td className="py-2.5 px-1 text-right font-mono text-slate-400">-</td>
              <td className="py-2.5 px-2 text-right font-mono text-amber-700">{formatNumber(totalClayOnly)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
