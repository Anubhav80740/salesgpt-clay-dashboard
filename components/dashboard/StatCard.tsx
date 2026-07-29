import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: 'blue' | 'green' | 'orange' | 'red' | 'slate';
  badge?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'blue',
  badge,
}: StatCardProps) {
  const getIconStyles = () => {
    switch (iconColor) {
      case 'blue':
        return 'bg-blue-50 text-salesgpt-600 border border-blue-100';
      case 'green':
        return 'bg-emerald-50 text-clay-600 border border-emerald-100';
      case 'orange':
        return 'bg-orange-50 text-issue-orange border border-orange-100';
      case 'red':
        return 'bg-rose-50 text-issue-red border border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-soft hover:shadow-card transition-shadow flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${getIconStyles()}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
          {badge && <div>{badge}</div>}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
