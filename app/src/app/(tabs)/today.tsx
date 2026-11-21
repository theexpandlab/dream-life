import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card, Chip, Eyebrow, PillButton } from '@/components/ui';
import { AREAS, type AreaKey } from '@/lib/areas';
import { space } from '@/theme/tokens';

export default function Today() {
  const [picked, setPicked] = useState<Set<AreaKey>>(new Set());
  const toggle = (k: AreaKey) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  return (
    <Screen>
      <SectionHeader
        eyebrow={'02 / Daily'}
        before="daily "
        highlight="check-in"
        after="."
        sub="Did you show up for each area today? Tap what you did something for, even something small. 30 seconds, tops."
      />
      <View style={styles.pad}>
        <Card style={styles.gap}>
          <Eyebrow>Where did you show up today?</Eyebrow>
          <View style={styles.chips}>
            {AREAS.map((a) => (
              <Chip key={a.key} label={a.label} selected={picked.has(a.key)} onToggle={() => toggle(a.key)} />
            ))}
          </View>
          <PillButton label="Save today" />
        </Card>
      </View>
      <ComingSoon items={['Energy 1 to 5', "Today's win and one gratitude", 'Month calendar', 'Days showed up per area']} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.md },
  gap: { gap: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
