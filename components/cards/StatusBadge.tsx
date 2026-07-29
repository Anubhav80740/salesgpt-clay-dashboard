import React from 'react';

type StatusType =
  | 'Excellent'
  | 'Good'
  | 'Needs Attention'
  | 'Poor'
  | 'Cleaned'
  | 'In Progress'
  | 'Requires Review'
  | 'Pending'
  | 'Review'
  | 'Cleaning'
  | 'Resolved'
  | 'Ignored';

interface StatusBadgeProps {
  status: StatusType | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    // Country comparison statuses
    case 'Excellent':
      badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Good':
      badgeClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Needs Attention':
      badgeClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Poor':
      badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;

    // Duplicates statuses
    case 'Cleaned':
      badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'In Progress':
      badgeClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Requires Review':
      badgeClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;

    // Field issue statuses (exact spec colors)
    case 'Pending': // Orange #EA580C
      badgeClasses = 'bg-orange-50 text-[#EA580C] border-orange-200 font-semibold';
      break;
    case 'Review': // Blue #2563EB
      badgeClasses = 'bg-blue-50 text-[#2563EB] border-blue-200 font-semibold';
      break;
    case 'Cleaning': // Yellow #D97706
      badgeClasses = 'bg-amber-50 text-[#D97706] border-amber-200 font-semibold';
      break;
    case 'Resolved': // Green #16A34A
      badgeClasses = 'bg-emerald-50 text-[#16A34A] border-emerald-200 font-semibold';
      break;
    case 'Ignored': // Gray #64748B
      badgeClasses = 'bg-slate-100 text-[#64748B] border-slate-200 font-medium';
      break;
    default:
      badgeClasses = 'bg-slate-50 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${badgeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
}
