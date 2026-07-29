import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Table } from '@tanstack/react-table';

interface TablePaginationProps<T> {
  table: Table<T>;
}

export function TablePagination<T>({ table }: TablePaginationProps<T>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200/80 bg-slate-50/50 text-xs text-slate-600">
      <div className="flex items-center gap-2">
        <span>Showing</span>
        <span className="font-semibold text-slate-900">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
        </span>
        <span>to</span>
        <span className="font-semibold text-slate-900">
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}
        </span>
        <span>of</span>
        <span className="font-semibold text-slate-900">
          {table.getFilteredRowModel().rows.length}
        </span>
        <span>results</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="px-2 font-medium text-slate-700">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="ml-2 px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {[5, 10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
