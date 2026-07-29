import React from 'react';

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200/70 rounded-lg ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-soft space-y-3">
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-8 w-8 rounded-lg" />
      </div>
      <LoadingSkeleton className="h-8 w-36" />
      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
        <LoadingSkeleton className="h-3 w-20" />
        <LoadingSkeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden p-4 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <LoadingSkeleton className="h-9 w-64" />
        <LoadingSkeleton className="h-9 w-40" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <LoadingSkeleton className="h-4 flex-1" />
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="h-4 w-28" />
          <LoadingSkeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
