import { Redirect } from 'expo-router';

import { useAuth } from '@/lib/auth';
import { useOnboarding } from '@/lib/onboarding';
import { TEST_MODE } from '@/lib/testMode';

/** Front door: signed in goes Home, first-timers take the tour, everyone else creates an account or logs in. */
export default function Index() {
  const { session } = useAuth();
  const { profile } = useOnboarding();
  if (TEST_MODE) return <Redirect href={profile.done ? '/home' : '/onboarding'} />;
  if (session) return <Redirect href="/home" />;
  return <Redirect href={profile.done ? '/sign-up' : '/onboarding'} />;
}
