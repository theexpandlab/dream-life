import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FormMessage } from '@/components/FormMessage';
import { Card, Eyebrow, PillButton, Tile } from '@/components/ui';
import { AREAS } from '@/lib/areas';
import { listCheckins } from '@/lib/data/checkins';
import { listDaysSince } from '@/lib/data/days';
import { localDate, monthLabel } from '@/lib/dates';
import { monthPulse, streak, summarize, type Summary } from '@/lib/scores';
import { colors, fonts, space } from '@/theme/tokens';

const label = (k: string) => AREAS.find((a) => a.key === k)?.label ?? k;
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

type State = { summary: Summary | null; streak: number; daysLogged: number; rate: number | null };

/** Overview tiles from real check-ins. Reloads every time Home comes into view. */
export function OverviewLive() {
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      // 62 days back covers this month plus a long streak; fetch more when streaks get longer.
      const since = localDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 62));
      Promise.all([listCheckins(), listDaysSince(since)])
        .then(([checkins, days]) => {
          const pulse = monthPulse(days, today);
          setState({ summary: summarize(checkins), streak: streak(days.map((d) => d.date), today), ...pulse });
          setError(undefined);
        })
        .catch(() => setError("Couldn't load your numbers. Check your connection."));
    }, []),
  );

  if (error) return <View style={styles.pad}><FormMessage tone="bad" text={error} /></View>;
  if (!state) return <ActivityIndicator color={colors.ink} />;

  const s = state.summary;
  return (
    <View style={styles.pad}>
      {s ? (
        <View style={styles.row}>
          <Tile
            label="Life score"
            value={s.score != null ? `${s.score}` : '–'}
            note={s.change != null ? `${signed(s.change)} vs last month` : monthLabel(s.month)}
            noteTone={s.change == null ? undefined : s.change >= 0 ? 'good' : 'bad'}
          />
          <Tile label="All-time" value={s.allTime != null ? `${s.allTime}` : '–'} note={`Since ${monthLabel(s.since)}`} />
        </View>
      ) : (
        <Card style={styles.gap}>
          <Eyebrow>Your life score</Eyebrow>
          <Text style={styles.body}>Your life score starts the month you begin. Score your 10 areas once to see it here.</Text>
          <PillButton label="Do my monthly check-in" onPress={() => router.push('/reflect?section=monthly')} />
        </Card>
      )}

      <View style={styles.row}>
        <Tile label="Streak" value={`${state.streak}`} note={state.streak === 1 ? 'day in a row' : 'days in a row'} />
        <Tile label="Showing up" value={state.rate != null ? `${state.rate}%` : '–'} note={`${state.daysLogged} ${state.daysLogged === 1 ? 'day' : 'days'} this month`} />
      </View>

      {s?.strongest ? (
        <Card dark>
          <Eyebrow style={{ color: colors.lime }}>Strongest area</Eyebrow>
          <Text style={styles.heroText}>{label(s.strongest.area)}</Text>
          <Text style={styles.heroNote}>Scored {s.strongest.score}/10</Text>
        </Card>
      ) : null}
      {s?.weakest ? (
        <Card style={{ backgroundColor: colors.pink }}>
          <Eyebrow>Needs some love</Eyebrow>
          <Text style={styles.word}>{label(s.weakest.area)}</Text>
          <Text style={styles.body}>Scored {s.weakest.score}/10</Text>
        </Card>
      ) : null}

      {state.daysLogged === 0 ? (
        <PillButton label="Today's check-in" variant="secondary" onPress={() => router.push('/today')} />
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.md, gap: space.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  gap: { gap: space.sm },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.ink },
  heroText: { fontFamily: fonts.serif, fontSize: 36, color: colors.paper, marginTop: space.xs },
  heroNote: { fontFamily: fonts.sans, fontSize: 14, color: colors.cream },
  word: { fontFamily: fonts.serif, fontSize: 32, color: colors.ink },
});
