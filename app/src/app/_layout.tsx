import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
  useFonts,
} from '@expo-google-fonts/instrument-serif';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { OnboardingProvider, useOnboarding } from '@/lib/onboarding';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <Root />
    </OnboardingProvider>
  );
}

function Root() {
  const [fontsLoaded, fontError] = useFonts({ InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic });
  const { loaded, profile } = useOnboarding();
  const ready = (fontsLoaded || !!fontError) && loaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        <Stack.Protected guard={profile.done}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!profile.done}>
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false, animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
