'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';

export const COUNTRY_CODES: Record<string, string> = {
  'United States': 'us',
  'Canada': 'ca',
  'United Kingdom': 'gb',
  'Germany': 'de',
  'France': 'fr',
  'Australia': 'au',
  'India': 'in',
  'Japan': 'jp',
  'Brazil': 'br',
  'Mexico': 'mx',
  'Netherlands': 'nl',
  'Spain': 'es',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Italy': 'it',
  'Ireland': 'ie',
  'Israel': 'il',
  'Singapore': 'sg',
  'Romania': 'ro',
  'Argentina': 'ar',
  'Belgium': 'be',
  'Austria': 'at',
  'Denmark': 'dk',
  'Finland': 'fi',
  'Norway': 'no',
  'Poland': 'pl',
  'Portugal': 'pt',
  'South Africa': 'za',
  'South Korea': 'kr',
  'New Zealand': 'nz',
  'United Arab Emirates': 'ae',
};

interface CustomCountrySelectProps {
  value: string;
  onChange: (country: string) => void;
  className?: string;
}

const COUNTRY_LIST = Object.keys(COUNTRY_CODES);

export function CustomCountrySelect({ value, onChange, className = '' }: CustomCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCode = COUNTRY_CODES[value] || 'us';

  const filteredCountries = COUNTRY_LIST.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
      >
        <div className="flex items-center gap-2">
          <img
            src={`https://flagcdn.com/w40/${selectedCode}.png`}
            alt={value}
            className="w-4 h-3 object-cover rounded-2xs border border-slate-200 shadow-xs shrink-0"
          />
          <span className="truncate max-w-[120px]">{value}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Custom Scrollable Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Search Input Box */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Scrollable Countries List */}
            <div className="max-h-52 overflow-y-auto divide-y divide-slate-50 p-1 custom-scrollbar">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => {
                  const code = COUNTRY_CODES[country];
                  const isSelected = country === value;
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        onChange(country);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {code ? (
                          <img
                            src={`https://flagcdn.com/w40/${code}.png`}
                            alt={country}
                            className="w-4 h-3 object-cover rounded-2xs border border-slate-200 shadow-xs shrink-0"
                          />
                        ) : (
                          <span>🌐</span>
                        )}
                        <span>{country}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">No country found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
