'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { CountryComparisonRecord } from '@/types';
import { formatNumber } from '@/utils/formatters';
import { CoverageBar } from '@/components/cards/CoverageBar';
import { StatusBadge } from '@/components/cards/StatusBadge';
import { TablePagination } from './TablePagination';

import { COUNTRY_CODES } from '@/components/dashboard/CustomCountrySelect';

interface CountryTableProps {
  data: CountryComparisonRecord[];
}

export function CountryTable({ data }: CountryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'salesgpt', desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<CountryComparisonRecord>[] = [
    {
      accessorKey: 'country',
      header: 'Country',
      cell: (info) => {
        const countryName = info.getValue<string>();
        const code = COUNTRY_CODES[countryName];
        return (
          <div className="font-semibold text-slate-900 flex items-center gap-2">
            {code ? (
              <img
                src={`https://flagcdn.com/w40/${code}.png`}
                alt={countryName}
                className="w-4 h-3 object-cover rounded-2xs border border-slate-200 shadow-xs"
              />
            ) : (
              <span>🌐</span>
            )}
            <span>{countryName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'salesgpt',
      header: 'SalesGPT',
      cell: (info) => (
        <span className="font-semibold text-salesgpt-600 font-mono">
          {formatNumber(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'clayClean',
      header: 'Clay Dataset',
      cell: (info) => (
        <span className="text-slate-800 font-mono font-medium">
          {formatNumber(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'overlap',
      header: 'Overlap',
      cell: (info) => (
        <span className="font-semibold text-indigo-600 font-mono">
          {formatNumber(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'clayOnly',
      header: 'Clay Only',
      cell: (info) => (
        <span className="text-clay-600 font-mono font-medium">
          {formatNumber(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'salesgptOnly',
      header: 'SalesGPT Only',
      cell: (info) => (
        <span className="text-slate-600 font-mono">
          {formatNumber(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'coveragePct',
      header: 'Coverage %',
      cell: (info) => <CoverageBar percentage={info.getValue<number>()} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue<string>()} />,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search country..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{table.getFilteredRowModel().rows.length}</span> countries
        </div>
      </div>

      {/* Table Viewport with Sticky Header */}
      <div className="overflow-x-auto max-h-[560px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-sm z-10 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="py-3 px-4 select-none cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3.5 px-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-slate-400">
                  No country records found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <TablePagination table={table} />
    </div>
  );
}
