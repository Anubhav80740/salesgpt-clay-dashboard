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
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { FieldIssueRecord } from '@/types';
import { formatNumber } from '@/utils/formatters';
import { StatusBadge } from '@/components/cards/StatusBadge';
import { TablePagination } from './TablePagination';

interface IssueTableProps {
  data: FieldIssueRecord[];
}

export function IssueTable({ data }: IssueTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'affectedRecords', desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [issueTypeFilter, setIssueTypeFilter] = useState('All');

  const filteredData = data.filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (issueTypeFilter !== 'All' && item.issueType !== issueTypeFilter) return false;
    return true;
  });

  const columns: ColumnDef<FieldIssueRecord>[] = [
    {
      accessorKey: 'field',
      header: 'Field',
      cell: (info) => (
        <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
          {info.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: 'issue',
      header: 'Issue Description',
      cell: (info) => (
        <span className="text-slate-800 font-medium">{info.getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'affectedRecords',
      header: 'Affected Records',
      cell: (info) => (
        <span className="font-bold text-issue-red font-mono">
          {formatNumber(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'suggestedAction',
      header: 'Suggested Action',
      cell: (info) => (
        <span className="text-slate-600 text-[11px] leading-relaxed block max-w-xs">
          {info.getValue<string>()}
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
    data: filteredData,
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

  const issueTypes = ['All', ...Array.from(new Set(data.map((d) => d.issueType)))];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Search & In-Table Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search field or issue..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending (Orange)</option>
              <option value="Review">Review (Blue)</option>
              <option value="Cleaning">Cleaning (Yellow)</option>
              <option value="Resolved">Resolved (Green)</option>
              <option value="Ignored">Ignored (Gray)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Issue Type:</span>
            <select
              value={issueTypeFilter}
              onChange={(e) => setIssueTypeFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
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
                  No field issue records found matching current criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
