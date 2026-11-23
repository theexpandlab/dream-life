/** Local calendar date as YYYY-MM-DD (not UTC, so late-night check-ins land on the right day). */
export function localDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 'YYYY-MM' for a date. */
export function monthKey(d = new Date()): string {
  return localDate(d).slice(0, 7);
}

/** Moves a 'YYYY-MM' key by n months. */
export function shiftMonth(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number);
  return monthKey(new Date(y, m - 1 + n, 1));
}

/** 'November 2026' */
export function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** 'Nov' */
export function monthShort(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' });
}
