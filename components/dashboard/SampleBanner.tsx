import React from 'react';
import { Info } from 'lucide-react';

export function SampleBanner() {
  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-xs font-medium text-amber-900 flex items-center justify-center gap-2 shadow-sm">
      <Info className="w-4 h-4 text-amber-600 shrink-0" />
      <span>
        <strong className="font-semibold">Sample dashboard data.</strong> Counts are placeholders and should not be used for final reporting.
      </span>
    </div>
  );
}
