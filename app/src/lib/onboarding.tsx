import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { AreaKey } from '@/lib/areas';

export type Reminder = 'morning' | 'midday' | 'evening' | 'none';

export type Profile = {
  done: boolean;
  name: string;
  focusAreas: AreaKey[];
  firstWin: string;
  horizon: 'y1' | 'y3' | 'y5';
  reminder: Reminder;
  /** True once these answers have been copied to the account. */
  synced: boolean;
};

const KEY = 'dreamlife.onboarding.v1';
const EMPTY: Profile = { done: false, name: '', focusAreas: [], firstWin: '', horizon: 'y1', reminder: 'morning', synced: false };

type Ctx = {
  loaded: boolean;
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
  finish: () => void;
  restart: () => void;
  /** Forget this device's answers on log out, so the next person starts clean. */
  clear: () => void;
};

const OnboardingContext = createContext<Ctx | null>(null);

/**
 * Holds onboarding answers on the device. When accounts arrive (Supabase),
 * copy these onto the user's profile row after sign-up.
 */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setProfile({ ...EMPTY, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = useCallback((next: Profile) => {
    setProfile(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      loaded,
      profile,
      update: (patch) => save({ ...profile, ...patch }),
      finish: () => save({ ...profile, done: true, synced: false }),
      restart: () => save({ ...profile, done: false }),
      clear: () => save({ ...EMPTY, done: true, synced: true }),
    }),
    [loaded, profile, save],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
