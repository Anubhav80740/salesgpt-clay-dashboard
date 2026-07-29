'use client';

import React from 'react';
import { Calendar, Menu, Building2, Users, Sparkles } from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function Topbar({
  onToggleSidebar,
  selectedDateRange,
  onDateRangeChange,
}: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title for small screens */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sparkles className="w-4 h-4 text-salesgpt-600" />
          <span className="font-bold text-slate-900 text-sm">SalesGPT Data Dashboard</span>
        </div>

        {/* Center Segmented Button Control matching screenshot */}
        <div className="hidden lg:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-white text-salesgpt-600 shadow-xs border border-slate-200/80">
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Data</span>
          </button>

          <button
            disabled
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 cursor-not-allowed opacity-80"
          >
            <Users className="w-3.5 h-3.5" />
            <span>People Data</span>
          </button>
        </div>
      </div>

      {/* Right Date Range Picker matching screenshot */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            <option value="Jul 14 - Jul 21, 2026">Jul 14 - Jul 21, 2026</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="Year to Date">Year to Date</option>
          </select>
        </div>
      </div>
    </header>
  );
}
