import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
  useFonts,
} from '@expo-google-fonts/instrument-serif';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

import { AuthProvider, useAuth } from '@/lib/auth';
import { loadProfile, saveOnboardingToAccount } from '@/lib/data/profile';
import { OnboardingProvider, useOnboarding } from '@/lib/onboarding';
import { TEST_MODE } from '@/lib/testMode';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <Root />
      </OnboardingProvider>
    </AuthProvider>
  );
}

function Root() {
  const [fontsLoaded, fontError] = useFonts({ InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic });
  const onboarding = useOnboarding();
  const auth = useAuth();
  const ready = (fontsLoaded || !!fontError) && onboarding.loaded && auth.loaded;
  const signedIn = TEST_MODE || !!auth.session;
  useSyncProfile();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream }, animation: 'fade' }}>
        {/* index.tsx decides where each person starts. */}
        <Stack.Screen name="index" />
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={TEST_MODE || !signedIn}>
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="sign-up" options={{ gestureEnabled: false }} />
          <Stack.Screen name="sign-in" options={{ gestureEnabled: false }} />
        </Stack.Protected>
        <Stack.Screen name="reset-password" />
      </Stack>
    </>
  );
}

/**
 * After sign-up: copy the tour answers to the account.
 * After logging in on a new device: pull the profile down instead of re-asking.
 */
function useSyncProfile() {
  const { session } = useAuth();
  const { profile, update } = useOnboarding();
  const synced = useRef<string | null>(null);

  useEffect(() => {
    const id = session?.user.id;
    if (!id) {
      synced.current = null; // logged out: the next login syncs again
      return;
    }
    if (synced.current === id) return;
    synced.current = id;
    (async () => {
      if (!profile.synced && profile.done && profile.name) {
        // Fresh sign-up on this device: send the tour answers up once.
        try {
          await saveOnboardingToAccount(id, profile);
          update({ synced: true });
        } catch {
          synced.current = null; // try again next time
        }
      } else if (!profile.name) {
        // Logged in on a new device or after log out: bring the profile down.
        const remote = await loadProfile(id);
        update({ ...(remote ?? {}), done: true, synced: true });
      }
    })();
  }, [session, profile, update]);
}
