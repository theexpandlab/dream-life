import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card, Eyebrow, Segments, Ticker, Tile } from '@/components/ui';
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
  return (
    <>
      <SectionHeader
        eyebrow={'01 / Overview'}
        before="your life, at a "
        highlight="glance"
        after="."
        sub="Your ongoing life score plus how consistently you're showing up day to day."
      />
      <Ticker />
      <View style={styles.pad}>
        <View style={styles.row}>
          <Tile label="Life score" value="7.4" note="+0.6 vs last month" noteTone="good" />
          <Tile label="Streak" value="12" note="days in a row" />
        </View>
        <Card dark>
          <Eyebrow style={{ color: colors.lime }}>Strongest area</Eyebrow>
          <Text style={styles.heroText}>Spirituality</Text>
        </Card>
      </View>
      <ComingSoon items={['Wheel of life chart', 'Life score trend line', 'Area that needs love']} />
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
  heroText: { fontFamily: fonts.serif, fontSize: 36, color: colors.paper, marginTop: space.xs },
});
