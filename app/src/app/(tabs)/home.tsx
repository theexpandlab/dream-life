import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ComingSoon } from '@/components/ComingSoon';
import { FeedbackCard } from '@/components/FeedbackCard';
import { OverviewLive } from '@/components/OverviewLive';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Segments, Ticker } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useOnboarding } from '@/lib/onboarding';
import { TEST_MODE } from '@/lib/testMode';
import { router } from 'expo-router';
import { colors, fonts, space } from '@/theme/tokens';

const SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'goals', label: 'Goals' },
] as const;
type Section = (typeof SECTIONS)[number]['key'];

export default function Home() {
  const [section, setSection] = useState<Section>('overview');
  return (
    <Screen top={<Segments options={SECTIONS} value={section} onChange={setSection} />}>
      {section === 'overview' ? <Overview /> : <Goals />}
    </Screen>
  );
}

/** Sample numbers until Supabase is wired up. */
function Overview() {
  const { profile, restart, clear } = useOnboarding();
  const { signOut } = useAuth();
  const name = profile.name.trim();
  return (
    <>
      <SectionHeader
        eyebrow={name ? `Hi, ${name} \u2726` : '01 / Overview'}
        before="your life, at a "
        highlight="glance"
        after="."
        sub="Your ongoing life score plus how consistently you're showing up day to day."
      />
      <Ticker />
      <OverviewLive />
      <ComingSoon items={['Wheel of life chart', 'Life score trend line']} />
      {TEST_MODE ? <FeedbackCard page="home" /> : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          restart();
          router.push('/onboarding');
        }}
        style={styles.tour}
      >
        <Text style={styles.tourTxt}>Take the tour again {'\u2192'}</Text>
      </Pressable>
      {TEST_MODE ? null : (
        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await signOut();
            clear();
          }}
          style={styles.tour}
        >
          <Text style={styles.tourTxt}>Log out</Text>
        </Pressable>
      )}
    </>
  );
}

function Goals() {
  return (
    <>
      <SectionHeader
        eyebrow={'05 / Goals'}
        before="your goals, "
        highlight="area by area"
        after="."
        sub="One clear goal per area, plus the next action that moves it forward."
      />
      <ComingSoon items={['A goal and next action for each of the 10 areas', 'Latest score and change per area']} />
    </>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.md, gap: space.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  tour: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', paddingHorizontal: space.md },
  tourTxt: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.ink, textDecorationLine: 'underline' },
  heroText: { fontFamily: fonts.serif, fontSize: 36, color: colors.paper, marginTop: space.xs },
});
