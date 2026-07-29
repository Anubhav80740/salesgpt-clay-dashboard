import React from 'react';

interface CoverageBarProps {
  percentage: number;
}

export function CoverageBar({ percentage }: CoverageBarProps) {
  const blocksCount = 10;
  const filledBlocks = Math.round((Math.min(100, Math.max(0, percentage)) / 100) * blocksCount);
  const emptyBlocks = blocksCount - filledBlocks;

  const filledChar = '█';
  const emptyChar = '░';

  const asciiString = `${filledChar.repeat(filledBlocks)}${emptyChar.repeat(emptyBlocks)}`;

  const getTextColor = (pct: number) => {
    if (pct >= 80) return 'text-emerald-600 font-semibold';
    if (pct >= 60) return 'text-blue-600 font-medium';
    if (pct >= 40) return 'text-amber-600 font-medium';
    return 'text-rose-600 font-medium';
  };

  return (
    <div className="flex items-center gap-2 font-mono text-xs select-none">
      <span className="tracking-tighter text-slate-700">{asciiString}</span>
      <span className={`min-w-[42px] text-right ${getTextColor(percentage)}`}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}
