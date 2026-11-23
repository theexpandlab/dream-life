/**
 * Scoring rules, ported from the prototype (prototype/lg-core.js, dash.calc blocks).
 * Pure functions: no network, no dates from the clock unless passed in. Covered by scores.test.ts.
 */
import { AREAS, type AreaKey } from './areas';

export type AreaScores = Partial<Record<AreaKey, number | null>>;
export type MonthRow = { month: string } & AreaScores; // month = 'YYYY-MM'
export type DayRow = { date: string } & Partial<Record<AreaKey, boolean>>; // date = 'YYYY-MM-DD'

const KEYS = AREAS.map((a) => a.key);
const round1 = (n: number) => Math.round(n * 10) / 10;
const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Monthly life score: mean of the scored areas, 1 decimal. Null if nothing scored. */
export function monthlyScore(scores: AreaScores): number | null {
  const vals = KEYS.map((k) => scores[k]).filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  return vals.length ? round1(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}

/** Score color band used across the app. */
export function band(score: number): 'thriving' | 'okay' | 'needs love' {
  return score >= 8 ? 'thriving' : score >= 5 ? 'okay' : 'needs love';
}

export type Summary = {
  month: string;
  score: number | null;
  allTime: number | null;
  change: number | null;
  since: string;
  months: number;
  strongest: { area: AreaKey; score: number } | null;
  weakest: { area: AreaKey; score: number } | null;
};

/** Everything the Overview needs from monthly check-ins. Null when there are none. */
export function summarize(checkins: MonthRow[]): Summary | null {
  const hist = [...checkins].sort((a, b) => (a.month < b.month ? -1 : a.month > b.month ? 1 : 0));
  if (!hist.length) return null;
  const cur = hist[hist.length - 1];
  const prev = hist.length > 1 ? hist[hist.length - 2] : null;
  const curScore = monthlyScore(cur);
  const prevScore = prev ? monthlyScore(prev) : null;
  const all = hist.map(monthlyScore).filter((v): v is number => v !== null);

  const scored = KEYS.filter((k) => typeof cur[k] === 'number').map((k) => ({ area: k, score: cur[k] as number }));
  // Stable sort keeps area order on ties, so the first area wins.
  const strongest = [...scored].sort((a, b) => b.score - a.score)[0] ?? null;
  const weakest = [...scored].sort((a, b) => a.score - b.score)[0] ?? null;

  return {
    month: cur.month,
    score: curScore,
    allTime: all.length ? round1(all.reduce((a, b) => a + b, 0) / all.length) : null,
    change: curScore !== null && prevScore !== null ? round1(curScore - prevScore) : null,
    since: hist[0].month,
    months: hist.length,
    strongest,
    weakest,
  };
}

/** Consecutive days checked in, counting back from today (or yesterday if today isn't logged yet). */
export function streak(dates: Iterable<string>, today: Date): number {
  const logged = new Set(dates);
  const cur = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!logged.has(ymd(cur))) cur.setDate(cur.getDate() - 1);
  let n = 0;
  while (logged.has(ymd(cur))) {
    n += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return n;
}

/** This month's daily pulse: days logged and the showing-up rate (whole percent, null if no days). */
export function monthPulse(days: DayRow[], today: Date): { daysLogged: number; rate: number | null } {
  const month = ymd(today).slice(0, 7);
  const inMonth = days.filter((d) => d.date.slice(0, 7) === month);
  let hits = 0;
  for (const d of inMonth) for (const k of KEYS) if (d[k] === true) hits += 1;
  return { daysLogged: inMonth.length, rate: inMonth.length ? Math.round((hits / (inMonth.length * 10)) * 100) : null };
}
