import React from 'react';

interface ProgressBadgeProps {
  percentage: number;
  showBar?: boolean;
}

export function ProgressBadge({ percentage, showBar = true }: ProgressBadgeProps) {
  const getBadgeStyle = (pct: number) => {
    if (pct >= 75) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (pct >= 50) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (pct >= 30) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const getBarColor = (pct: number) => {
    if (pct >= 75) return 'bg-emerald-500';
    if (pct >= 50) return 'bg-blue-500';
    if (pct >= 30) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="flex items-center gap-2">
      {showBar && (
        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(percentage)}`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      )}
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getBadgeStyle(percentage)}`}>
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
}
