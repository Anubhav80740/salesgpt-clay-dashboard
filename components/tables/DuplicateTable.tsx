'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { DuplicateTypeRecord } from '@/types';
import { formatNumber } from '@/utils/formatters';
import { StatusBadge } from '@/components/cards/StatusBadge';
import { TablePagination } from './TablePagination';

interface DuplicateTableProps {
  data: DuplicateTypeRecord[];
}

export function DuplicateTable({ data }: DuplicateTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'groups', desc: true },
  ]);

  const columns: ColumnDef<DuplicateTypeRecord>[] = [
    {
      accessorKey: 'duplicateType',
      header: 'Duplicate Type',
      cell: (info) => (
        <div className="font-semibold text-slate-900 flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
            style={{ backgroundColor: info.row.original.color }}
          />
          <span>{info.getValue<string>()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'groups',
      header: 'Duplicate Groups',
      cell: (info) => (
        <span className="font-semibold text-slate-900 font-mono">
          {formatNumber(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'rowsRemoved',
      header: 'Rows Removed',
      cell: (info) => (
        <span className="font-semibold text-issue-orange font-mono">
          {formatNumber(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'percentage',
      header: 'Share %',
      cell: (info) => (
        <span className="text-slate-600 font-mono">
          {info.getValue<number>().toFixed(1)}%
        </span>
      ),
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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900">Deduplication Category Log</h3>
        <span className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{data.length}</span> categories
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3.5 px-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
