'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SampleBanner } from '@/components/dashboard/SampleBanner';
import { FilterBar } from '@/components/filters/FilterBar';
import { GlobalFilterState } from '@/types';
import { getFilterOptions } from '@/services/dashboard';

const initialFilters: GlobalFilterState = {
  country: 'All',
  industry: 'All',
  employeeRange: 'All',
  dataSource: 'All',
  pipelineStatus: 'All',
  duplicateType: 'All',
  fieldIssue: 'All',
  dateRange: 'Last 30 Days',
  searchQuery: '',
};

interface DashboardShellProps {
  children: (props: {
    filters: GlobalFilterState;
    isRefreshing: boolean;
  }) => React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<GlobalFilterState>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('dashboard_global_filters');
      if (saved) {
        try {
          return { ...initialFilters, ...JSON.parse(saved) };
        } catch (e) {}
      }
    }
    return initialFilters;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filterOptions = getFilterOptions();

  const handleFilterChange = (newFilters: GlobalFilterState) => {
    setFilters(newFilters);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dashboard_global_filters', JSON.stringify(newFilters));
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dashboard_global_filters');
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col font-sans antialiased">
      {/* Sample Data Yellow Notification Banner */}
      <SampleBanner />

      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            selectedDateRange={filters.dateRange}
            onDateRangeChange={(range) => setFilters({ ...filters, dateRange: range })}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
            {/* Global Filter Bar */}
            <FilterBar
              filters={filters}
              options={filterOptions}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {/* Page View Renderer */}
            {children({ filters, isRefreshing })}
          </main>
        </div>
      </div>
    </div>
  );
}
