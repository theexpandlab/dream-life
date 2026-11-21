import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Chip, Eyebrow, Headline, PillButton, Ticker, Tile } from '@/components/ui';
import { AREAS, type AreaKey } from '@/lib/areas';
import { colors, fonts, space } from '@/theme/tokens';

/**
 * Temporary home screen: shows the UI kit with sample values so the look can be
 * checked on a phone. Replaced by the real Overview and Daily check-in screens.
 */
export default function Home() {
  const [picked, setPicked] = useState<Set<AreaKey>>(new Set(['health', 'spirituality']));
  const toggle = (k: AreaKey) =>
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.pad}>
          <Eyebrow>Daily {'✦'} Weekly {'✦'} Monthly</Eyebrow>
          <Headline before="your life, at a " highlight="glance" after="." />
        </View>

        <Ticker />

        <View style={[styles.pad, styles.gap]}>
          <View style={styles.row}>
            <Tile label="Life score" value="7.4" note="+0.6 vs last month" noteTone="good" />
            <Tile label="Streak" value="12" note="days in a row" />
          </View>

          <Card dark>
            <Eyebrow style={{ color: colors.lime }}>Strongest area</Eyebrow>
            <Text style={styles.heroText}>Spirituality</Text>
          </Card>

          <Card style={styles.gap}>
            <Eyebrow>Where did you show up today?</Eyebrow>
            <View style={styles.chips}>
              {AREAS.map((a) => (
                <Chip key={a.key} label={a.label} selected={picked.has(a.key)} onToggle={() => toggle(a.key)} />
              ))}
            </View>
            <PillButton label="Save check-in" />
            <PillButton label="Skip for today" variant="secondary" />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingTop: space.md, paddingBottom: space.xl, gap: space.lg },
  pad: { paddingHorizontal: space.md, gap: space.sm },
  gap: { gap: space.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  heroText: { fontFamily: fonts.serif, fontSize: 36, color: colors.paper, marginTop: space.xs },
});
