'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Menu, Building2, Users, BarChart3, LogOut, UserCheck, Sliders } from 'lucide-react';
import { CustomSelect } from '@/components/dashboard/CustomSelect';

interface TopbarProps {
  onToggleSidebar: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function Topbar({
  onToggleSidebar,
  onOpenFilters,
  activeFilterCount = 0,
  selectedDateRange,
  onDateRangeChange,
}: TopbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      router.push('/login');
    }
  };

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
          <BarChart3 className="w-4 h-4 text-salesgpt-600" />
          <span className="font-bold text-slate-900 text-sm">SalesGPT Data Dashboard</span>
        </div>

        {/* Center Segmented Button Control matching screenshot */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Main Segmented Toggle */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-blue-600 shadow-xs border border-slate-200/80">
              <Building2 className="w-3.5 h-3.5" />
              <span>Company Data</span>
            </button>

            <button
              disabled
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 cursor-not-allowed opacity-80"
              title="People Data is not accessible"
            >
              <Users className="w-3.5 h-3.5" />
              <span>People Data</span>
            </button>
          </div>

          {/* Sub-Category Toggle: Tech vs Non-Tech Companies */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-600 shadow-xs border border-slate-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Tech Companies</span>
            </button>

            <button
              disabled
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 cursor-not-allowed opacity-80"
              title="Non-Tech Companies database access is disabled"
            >
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              <span>Non-Tech Companies</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right controls: Filter Drawer Trigger + Date Range Picker + Sign Out */}
      <div className="flex items-center gap-3">
        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Filter Data</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        <CustomSelect
          value={selectedDateRange}
          options={[
            'Jul 14 - Jul 21, 2026',
            'Last 7 Days',
            'Last 30 Days',
            'Last 90 Days',
            'Year to Date'
          ]}
          onChange={onDateRangeChange}
          icon={Calendar}
        />

        {/* Logged in User Indicator & Sign Out */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-800">Team Login</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
