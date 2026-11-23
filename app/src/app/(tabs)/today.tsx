import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ComingSoon } from '@/components/ComingSoon';
import { FormMessage } from '@/components/FormMessage';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card, Chip, Eyebrow, PillButton } from '@/components/ui';
import { AREAS, type AreaKey } from '@/lib/areas';
import { useAuth } from '@/lib/auth';
import { TEST_MODE } from '@/lib/testMode';
import { getDay, saveDay } from '@/lib/data/days';
import { localDate } from '@/lib/dates';
import { celebrate, tick } from '@/lib/haptics';
import { useOnboarding } from '@/lib/onboarding';
import { colors, space } from '@/theme/tokens';

export default function Today() {
  const { session } = useAuth();
  const { profile } = useOnboarding();
  const today = localDate();
  const [picked, setPicked] = useState<Set<AreaKey>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'good' | 'bad'; text: string }>();

  // Focus areas from onboarding go first.
  const focus = new Set(profile.focusAreas);
  const ordered = [...AREAS.filter((a) => focus.has(a.key)), ...AREAS.filter((a) => !focus.has(a.key))];

  useEffect(() => {
    getDay(today)
      .then((d) => d && setPicked(new Set(d.areas)))
      .catch(() => setMsg({ tone: 'bad', text: "Couldn't load today's check-in. Pull down to try again." }))
      .finally(() => setLoading(false));
  }, [today]);

  const toggle = (k: AreaKey) => {
    tick();
    setMsg(undefined);
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const save = async () => {
    const userId = session?.user.id ?? (TEST_MODE ? 'device' : null);
    if (!userId) return;
    setSaving(true);
    setMsg(undefined);
    try {
      await saveDay(userId, { date: today, areas: [...picked], energy: null, win: '', note: '' });
      celebrate();
      setMsg({ tone: 'good', text: 'Saved. Keep that streak going \u2705' });
    } catch {
      setMsg({ tone: 'bad', text: "That wasn't saved. Try again." });
    } finally {
      setSaving(false);
    }
  };

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
          {loading ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <View style={styles.chips}>
              {ordered.map((a) => (
                <Chip key={a.key} label={a.label} selected={picked.has(a.key)} onToggle={() => toggle(a.key)} />
              ))}
            </View>
          )}
          <PillButton label={saving ? 'Saving...' : 'Save today'} onPress={save} disabled={saving || loading} />
          <FormMessage tone={msg?.tone ?? 'good'} text={msg?.text} />
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
