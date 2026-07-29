export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}

export function formatPercentage(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatDiff(diff: number): string {
  if (diff > 0) return `+${formatNumber(diff)}`;
  return formatNumber(diff);
}
