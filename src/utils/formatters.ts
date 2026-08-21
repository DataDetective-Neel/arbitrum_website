/* ============================================
   LAYER//LAB — Formatting Utilities
   ============================================ */

/**
 * Format a number as USD price.
 * BTC-range: $104,321.45
 * ETH-range: $3,456.78
 * Small: $1.23
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value >= 100 ? 2 : value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 100 ? 2 : value >= 1 ? 2 : 4,
  }).format(value);
}

/**
 * Format a percentage with sign and fixed decimals.
 * +2.45% or -1.23%
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a Date or timestamp to HH:MM:SS.
 */
export function formatTime(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Format timestamp to localized date string: "Aug 21, 2026".
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format timestamp to concise date/time for tooltips: "Aug 21, 2026 · 14:30".
 */
export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${dateStr} · ${timeStr}`;
}

/**
 * Format timestamp for chart X-axis labels (e.g. "Aug 21" or "08/21").
 */
export function formatAxisDate(timestamp: number, days: number): string {
  const d = new Date(timestamp);
  if (days <= 7) {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      hour: 'numeric',
    });
  }
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate a hash string for display.
 * 0x7f83b165...9d9069
 */
export function truncateHash(hash: string, startLen = 8, endLen = 6): string {
  if (hash.length <= startLen + endLen + 3) return hash;
  return `${hash.slice(0, startLen)}...${hash.slice(-endLen)}`;
}
