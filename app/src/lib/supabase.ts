import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** False until app/.env has the Supabase URL and anon key. See SUPABASE_SETUP.md. */
export const isSupabaseConfigured = url.startsWith('https://') && anonKey.length > 20;

export const supabase = createClient(
  isSupabaseConfigured ? url : 'https://not-configured.supabase.co',
  isSupabaseConfigured ? anonKey : 'not-configured',
  {
    auth: {
      // Keeps people logged in between app launches.
      storage: Platform.OS === 'web' ? undefined : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // On web, password reset links land back in the browser with a session.
      detectSessionInUrl: Platform.OS === 'web',
    },
  },
);

// Refresh the session only while the app is in the foreground (Supabase guidance for React Native).
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
