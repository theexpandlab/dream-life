import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { FormMessage } from '@/components/FormMessage';
import { ScoreScale } from '@/components/ScoreScale';
import { SectionHeader } from '@/components/SectionHeader';
import { Card, Eyebrow, PillButton, TextField } from '@/components/ui';
import { AREAS } from '@/lib/areas';
import { useAuth } from '@/lib/auth';
import { listCheckins, saveCheckin, type Checkin } from '@/lib/data/checkins';
import { monthKey, monthLabel, shiftMonth, monthShort } from '@/lib/dates';
import { celebrate } from '@/lib/haptics';
import { band, monthlyScore } from '@/lib/scores';
import { colors, fonts, scoreColor, space } from '@/theme/tokens';

const blank = (month: string): Checkin => ({ month, win: '', god: '', focus: '' });

export function MonthlyCheckin() {
  const { session } = useAuth();
  const thisMonth = monthKey();
  const [month, setMonth] = useState(thisMonth);
  const [all, setAll] = useState<Checkin[]>([]);
  const [draft, setDraft] = useState<Checkin>(blank(thisMonth));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'good' | 'bad'; text: string }>();

  const load = useCallback(async () => {
    try {
      const rows = await listCheckins();
      setAll(rows);
      return rows;
    } catch {
      setMsg({ tone: 'bad', text: "Couldn't load your check-ins. Check your connection." });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().then((rows) => setDraft(rows.find((r) => r.month === month) ?? blank(month)));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load]),
  );

  const pick = (m: string) => {
    setMonth(m);
    setMsg(undefined);
    setDraft(all.find((r) => r.month === m) ?? blank(m));
  };

  const scoredCount = AREAS.filter((a) => typeof draft[a.key] === 'number').length;
  const live = monthlyScore(draft);
  const history = useMemo(() => [...all].sort((a, b) => (a.month < b.month ? 1 : -1)), [all]);

  const save = async () => {
    if (!session) return;
    if (scoredCount < 10) return setMsg({ tone: 'bad', text: `Score all 10 areas first (${10 - scoredCount} to go).` });
    setSaving(true);
    setMsg(undefined);
    try {
      await saveCheckin(session.user.id, draft);
      celebrate();
      setMsg({ tone: 'good', text: 'Check-in saved. Proud of you ✅' });
      await load();
    } catch {
      setMsg({ tone: 'bad', text: "That wasn't saved. Try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator color={colors.ink} style={{ marginTop: space.xl }} />;

  return (
    <>
      <SectionHeader
        eyebrow={'04 / Monthly'}
        before="monthly "
        highlight="check-in"
        after="."
        sub="Score each area from 1 (struggling) to 10 (thriving). Be honest, nobody's grading you :) This is what builds your life score."
      />

      <View style={styles.pad}>
        <View style={styles.monthRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => pick(shiftMonth(month, -1))} style={styles.arrow}>
            <Text style={styles.arrowTxt}>{'←'}</Text>
          </Pressable>
          <Text style={styles.month}>{monthLabel(month).toLowerCase()}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            disabled={month >= thisMonth}
            onPress={() => pick(shiftMonth(month, 1))}
            style={[styles.arrow, month >= thisMonth && { opacity: 0.25 }]}
          >
            <Text style={styles.arrowTxt}>{'→'}</Text>
          </Pressable>
        </View>

        <Card style={[styles.liveCard, live != null && { backgroundColor: scoreColor(live) }]}>
          <View>
            <Eyebrow>Life score this month</Eyebrow>
            <Text style={styles.small}>{live != null ? `${band(live)} ✦ ${scoredCount} of 10 scored` : 'Tap a number for each area'}</Text>
          </View>
          <Text style={styles.big}>{live ?? '–'}</Text>
        </Card>

        <View>
          {AREAS.map((a) => (
            <ScoreScale
              key={a.key}
              label={a.label}
              value={draft[a.key]}
              onChange={(n) => {
                setMsg(undefined);
                setDraft((d) => ({ ...d, [a.key]: n }));
              }}
            />
          ))}
        </View>

        <TextField label="Biggest win this month" value={draft.win} onChangeText={(win) => setDraft((d) => ({ ...d, win }))} multiline autoCapitalize="sentences" autoCorrect style={styles.area} />
        <TextField label="Where I saw God move" value={draft.god} onChangeText={(god) => setDraft((d) => ({ ...d, god }))} multiline autoCapitalize="sentences" autoCorrect style={styles.area} />
        <TextField label="Focus for next month" value={draft.focus} onChangeText={(focus) => setDraft((d) => ({ ...d, focus }))} multiline autoCapitalize="sentences" autoCorrect style={styles.area} />

        <PillButton label={saving ? 'Saving...' : 'Save check-in'} onPress={save} disabled={saving} />
        <FormMessage tone={msg?.tone ?? 'good'} text={msg?.text} />
      </View>

      <View style={styles.pad}>
        <Eyebrow>The receipts</Eyebrow>
        {history.length === 0 ? (
          <Text style={styles.small}>No monthly check-ins yet. Your first one lands here.</Text>
        ) : (
          history.map((h) => {
            const s = monthlyScore(h);
            return (
              <Pressable key={h.month} accessibilityRole="button" onPress={() => pick(h.month)} style={styles.receipt}>
                <Text style={styles.receiptMonth}>{monthShort(h.month)} {h.month.slice(0, 4)}</Text>
                <View style={styles.swatches}>
                  {AREAS.map((a) => (
                    <View key={a.key} style={[styles.swatch, h[a.key] != null && { backgroundColor: scoreColor(h[a.key] as number) }]} />
                  ))}
                </View>
                <Text style={styles.receiptScore}>{s ?? '–'}</Text>
              </Pressable>
            );
          })
        )}
        {history.length ? <Text style={styles.small}>Green is 8+, yellow 5 to 7, pink 4 or below. Tap a month to edit it.</Text> : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.md, gap: space.md },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.ink, borderRadius: 300 },
  arrowTxt: { fontFamily: fonts.mono, fontSize: 18, color: colors.ink },
  month: { fontFamily: fonts.serif, fontSize: 28, color: colors.ink },
  liveCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  big: { fontFamily: fonts.serif, fontSize: 56, lineHeight: 60, color: colors.ink },
  small: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.ink },
  area: { minHeight: 84, paddingTop: 14, textAlignVertical: 'top' },
  receipt: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 44, borderBottomWidth: 1, borderBottomColor: colors.ink },
  receiptMonth: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.ink, width: 76 },
  swatches: { flex: 1, flexDirection: 'row', gap: 3 },
  swatch: { flex: 1, height: 18, borderWidth: 1, borderColor: colors.ink, backgroundColor: colors.paper },
  receiptScore: { fontFamily: fonts.serif, fontSize: 24, color: colors.ink, width: 40, textAlign: 'right' },
});
