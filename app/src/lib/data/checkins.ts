import { AREAS } from '@/lib/areas';
import type { MonthRow } from '@/lib/scores';
import { supabase } from '@/lib/supabase';

export type Checkin = MonthRow & { win: string; god: string; focus: string };

const KEYS = AREAS.map((a) => a.key);
// The database stores the first day of the month; the app uses 'YYYY-MM'.
const toDb = (month: string) => `${month}-01`;
const fromDb = (date: string) => date.slice(0, 7);

function toCheckin(r: Record<string, unknown>): Checkin {
  const c: Checkin = { month: fromDb(String(r.month)), win: String(r.win ?? ''), god: String(r.god ?? ''), focus: String(r.focus ?? '') };
  for (const k of KEYS) c[k] = typeof r[k] === 'number' ? (r[k] as number) : null;
  return c;
}

/** Every monthly check-in, oldest first. */
export async function listCheckins(): Promise<Checkin[]> {
  const { data, error } = await supabase.from('checkins').select('*').order('month', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toCheckin);
}

/** Saves a month. One row per user per month, so saving again edits it. */
export async function saveCheckin(userId: string, c: Checkin) {
  const row: Record<string, unknown> = {
    user_id: userId,
    month: toDb(c.month),
    win: c.win,
    god: c.god,
    focus: c.focus,
    saved_at: new Date().toISOString(),
  };
  for (const k of KEYS) row[k] = c[k] ?? null;
  const { error } = await supabase.from('checkins').upsert(row, { onConflict: 'user_id,month' });
  if (error) throw error;
}
