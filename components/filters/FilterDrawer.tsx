'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, X, RotateCcw, Check } from 'lucide-react';
import { GlobalFilterState, FilterOptions } from '@/types';
import { CustomSelect } from '@/components/dashboard/CustomSelect';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: GlobalFilterState;
  options: FilterOptions;
  onChange: (newFilters: GlobalFilterState) => void;
  onReset: () => void;
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  options,
  onChange,
  onReset
}: FilterDrawerProps) {
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* E-Commerce Slide-Out Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Data Filters & Slicers</span>
                    {activeCount > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {activeCount} active
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500">Filter all metrics and table views in real-time</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body — Filter Custom Dropdowns */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* Country */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Country</label>
                <CustomSelect
                  value={filters.country}
                  options={options.countries}
                  onChange={(val) => handleSelectChange('country', val)}
                  className="w-full"
                />
              </div>

              {/* Industry */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Industry</label>
                <CustomSelect
                  value={filters.industry}
                  options={options.industries}
                  onChange={(val) => handleSelectChange('industry', val)}
                  className="w-full"
                />
              </div>

              {/* Employee Range */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Employee Headcount Tier</label>
                <CustomSelect
                  value={filters.employeeRange}
                  options={options.employeeRanges}
                  onChange={(val) => handleSelectChange('employeeRange', val)}
                  className="w-full"
                />
              </div>

              {/* Data Source */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Data Source</label>
                <CustomSelect
                  value={filters.dataSource}
                  options={options.dataSources}
                  onChange={(val) => handleSelectChange('dataSource', val)}
                  className="w-full"
                />
              </div>

              {/* Pipeline Stage */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Pipeline Stage</label>
                <CustomSelect
                  value={filters.pipelineStatus}
                  options={options.pipelineStatuses}
                  onChange={(val) => handleSelectChange('pipelineStatus', val)}
                  className="w-full"
                />
              </div>

              {/* Duplicate Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Duplicate Match Category</label>
                <CustomSelect
                  value={filters.duplicateType}
                  options={options.duplicateTypes}
                  onChange={(val) => handleSelectChange('duplicateType', val)}
                  className="w-full"
                />
              </div>

              {/* Field Issue Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Field Issue Type</label>
                <CustomSelect
                  value={filters.fieldIssue}
                  options={options.fieldIssues}
                  onChange={(val) => handleSelectChange('fieldIssue', val)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-white transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
