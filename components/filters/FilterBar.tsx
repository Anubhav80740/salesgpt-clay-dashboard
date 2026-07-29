'use client';

import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { GlobalFilterState, FilterOptions } from '@/types';

interface FilterBarProps {
  filters: GlobalFilterState;
  options: FilterOptions;
  onChange: (newFilters: GlobalFilterState) => void;
  onReset: () => void;
}

export function FilterBar({ filters, options, onChange, onReset }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectChange = (key: keyof GlobalFilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const activeCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'dateRange' && key !== 'searchQuery' && value !== 'All'
  ).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-soft mb-6 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-salesgpt-600">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              Global Data Filters
              {activeCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                  {activeCount} active
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500">Filter all dashboard panels and service queries in real-time</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          {/* Country */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleSelectChange('country', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {options.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => handleSelectChange('industry', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {options.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Range */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Employee Range</label>
            <select
              value={filters.employeeRange}
              onChange={(e) => handleSelectChange('employeeRange', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {options.employeeRanges.map((er) => (
                <option key={er} value={er}>
                  {er}
                </option>
              ))}
            </select>
          </div>

          {/* Data Source */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Data Source</label>
            <select
              value={filters.dataSource}
              onChange={(e) => handleSelectChange('dataSource', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {options.dataSources.map((ds) => (
                <option key={ds} value={ds}>
                  {ds}
                </option>
              ))}
            </select>
          </div>

          {/* Pipeline Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pipeline Stage</label>
            <select
              value={filters.pipelineStatus}
              onChange={(e) => handleSelectChange('pipelineStatus', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {options.pipelineStatuses.map((ps) => (
                <option key={ps} value={ps}>
                  {ps}
                </option>
              ))}
            </select>
          </div>

          {/* Duplicate Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duplicate Type</label>
            <select
              value={filters.duplicateType}
              onChange={(e) => handleSelectChange('duplicateType', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {options.duplicateTypes.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>

          {/* Field Issue Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Field Issue</label>
            <select
              value={filters.fieldIssue}
              onChange={(e) => handleSelectChange('fieldIssue', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {options.fieldIssues.map((fi) => (
                <option key={fi} value={fi}>
                  {fi}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
