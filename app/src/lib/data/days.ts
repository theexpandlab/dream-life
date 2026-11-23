import { AREAS, type AreaKey } from '@/lib/areas';
import { readLocal, writeLocal } from '@/lib/data/local';
import { supabase } from '@/lib/supabase';
import { TEST_MODE } from '@/lib/testMode';

export type Day = { date: string; areas: AreaKey[]; energy: number | null; win: string; note: string };

const AREA_KEYS = AREAS.map((a) => a.key);

/** Today's (or any day's) daily check-in, or null if not logged. */
export async function getDay(date: string): Promise<Day | null> {
  if (TEST_MODE) return (await readLocal<Record<string, Day>>('days', {}))[date] ?? null;
  const { data, error } = await supabase.from('days').select('*').eq('date', date).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    date: data.date,
    areas: AREA_KEYS.filter((k) => data[k] === true),
    energy: data.energy,
    win: data.win ?? '',
    note: data.note ?? '',
  };
}

/** Saves a daily check-in. One row per user per date, so saving again edits it. */
export async function saveDay(userId: string, day: Day) {
  if (TEST_MODE) {
    const all = await readLocal<Record<string, Day>>('days', {});
    all[day.date] = day;
    return writeLocal('days', all);
  }
  const row: Record<string, unknown> = {
    user_id: userId,
    date: day.date,
    energy: day.energy,
    win: day.win,
    note: day.note,
    saved_at: new Date().toISOString(),
  };
  for (const k of AREA_KEYS) row[k] = day.areas.includes(k);
  const { error } = await supabase.from('days').upsert(row, { onConflict: 'user_id,date' });
  if (error) throw error;
}

/** Daily check-ins on or after a date (for streaks and this month's pulse). */
export async function listDaysSince(date: string): Promise<({ date: string } & Partial<Record<AreaKey, boolean>>)[]> {
  if (TEST_MODE) {
    const all = await readLocal<Record<string, Day>>('days', {});
    return Object.values(all)
      .filter((d) => d.date >= date)
      .map((d) => ({ date: d.date, ...Object.fromEntries(AREA_KEYS.map((k) => [k, d.areas.includes(k)])) }));
  }
  const { data, error } = await supabase.from('days').select(['date', ...AREA_KEYS].join(',')).gte('date', date);
  if (error) throw error;
  return (data ?? []) as unknown as ({ date: string } & Partial<Record<AreaKey, boolean>>)[];
}
