'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe2,
  CopyX,
  GitMerge,
  ShieldAlert,
  Sliders,
  Settings,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Compare by Country', href: '/countries', icon: Globe2 },
    { name: 'Duplicates', href: '/duplicates', icon: CopyX },
    { name: 'Pipeline', href: '/pipeline', icon: GitMerge },
    { name: 'Data Quality', href: '/field-issues', icon: ShieldAlert },
    { name: 'Filters', href: '/#filters', icon: Sliders },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Dashboard Header Logo matching screenshot */}
          <div className="h-16 px-5 border-b border-slate-100 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-salesgpt-600 shrink-0" />
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              SalesGPT Data Dashboard
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50/90 text-salesgpt-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-salesgpt-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Info Box matching screenshot */}
        <div className="p-4 m-3 bg-slate-50/80 border border-slate-200/60 rounded-xl space-y-2 text-xs">
          <div>
            <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400">About</div>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
              Track and compare tech company data across multiple sources.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
            <div>
              <span className="text-slate-400 font-medium block text-[10px]">Last Sync</span>
              <span className="font-semibold text-slate-700">21 Jul 2026, 10:30 AM</span>
            </div>
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 hover:text-salesgpt-600 cursor-pointer" />
          </div>
        </div>
      </aside>
    </>
  );
}
