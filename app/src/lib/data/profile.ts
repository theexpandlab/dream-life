import type { Profile } from '@/lib/onboarding';
import { supabase } from '@/lib/supabase';

/** Copies onboarding answers onto the signed-in user's profile, plus their first win. */
export async function saveOnboardingToAccount(userId: string, p: Profile) {
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    name: p.name.trim(),
    focus_areas: p.focusAreas,
    reminder: p.reminder,
    dream_horizon: p.horizon,
    onboarded_at: new Date().toISOString(),
  });
  if (error) throw error;
  if (p.firstWin) {
    const { count } = await supabase.from('wins').select('id', { count: 'exact', head: true });
    if (!count) await supabase.from('wins').insert({ user_id: userId, text: p.firstWin });
  }
}

/** Pulls the profile after logging in on a new device. */
export async function loadProfile(userId: string): Promise<Partial<Profile> | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, focus_areas, reminder, dream_horizon')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    name: data.name ?? '',
    focusAreas: data.focus_areas ?? [],
    reminder: data.reminder ?? 'morning',
    horizon: data.dream_horizon ?? 'y1',
  };
}
