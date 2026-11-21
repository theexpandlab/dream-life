import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BreathingCircle, Card, Chip, Eyebrow, Headline, Ticker } from '@/components/ui';
import { AREAS, type AreaKey } from '@/lib/areas';
import { celebrate, tick } from '@/lib/haptics';
import type { Profile, Reminder } from '@/lib/onboarding';
import { colors, fonts, radius, scoreColor, space, tap } from '@/theme/tokens';

export type StepProps = {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
  /** Lets a step block the main button until the user has tried it. */
  setReady: (ready: boolean) => void;
};

const labelOf = (k: AreaKey) => AREAS.find((a) => a.key === k)?.label ?? k;

function Sub({ children, light }: { children: string; light?: boolean }) {
  return <Text style={[s.sub, light && { color: colors.cream }]}>{children}</Text>;
}

/* 1. Welcome */
export function Welcome() {
  return (
    <View style={s.center}>
      <Eyebrow>Dream Life {'✦'} by The Expand Lab</Eyebrow>
      <Headline before="welcome to your " highlight="dream" after=" life." size={46} />
      <Sub>See who you're becoming, check whether you're showing up for it, and keep the proof along the way.</Sub>
      <View style={s.bleed}>
        <Ticker />
      </View>
      <Sub>This quick tour takes about a minute. You'll try each part as we go.</Sub>
    </View>
  );
}

/* 2. Name */
export function Name({ profile, update, setReady }: StepProps) {
  useEffect(() => setReady(profile.name.trim().length > 0), [profile.name, setReady]);
  return (
    <View style={s.gap}>
      <Eyebrow>First things first</Eyebrow>
      <Headline before="what should we " highlight="call" after=" you?" size={40} />
      <TextInput
        value={profile.name}
        onChangeText={(name) => update({ name })}
        placeholder="Your first name"
        placeholderTextColor="#8a8a80"
        autoFocus
        autoCapitalize="words"
        autoComplete="given-name"
        returnKeyType="done"
        style={s.input}
        accessibilityLabel="Your first name"
      />
      {profile.name.trim() ? <Sub>{`Love that. Hi, ${profile.name.trim()} ✦`}</Sub> : null}
    </View>
  );
}

/* 3. Areas */
export function Areas({ profile, update, setReady }: StepProps) {
  const picked = new Set(profile.focusAreas);
  useEffect(() => setReady(profile.focusAreas.length > 0), [profile.focusAreas, setReady]);
  const toggle = (k: AreaKey) => {
    tick();
    const next = new Set(picked);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    update({ focusAreas: AREAS.map((a) => a.key).filter((x) => next.has(x)) });
  };
  return (
    <View style={s.gap}>
      <Eyebrow>Step 1 {'✦'} the big picture</Eyebrow>
      <Headline before="your life has " highlight="10" after=" areas." size={40} />
      <Sub>Tap the ones you want to give some love to first. You'll track all 10, these just go to the top.</Sub>
      <View style={s.chips}>
        {AREAS.map((a) => (
          <Chip key={a.key} label={a.label} selected={picked.has(a.key)} onToggle={() => toggle(a.key)} />
        ))}
      </View>
      <Text style={s.mono}>{picked.size} picked</Text>
    </View>
  );
}

/* 4. Daily check-in, live */
export function Daily({ profile, setReady }: StepProps) {
  const areas = profile.focusAreas.length ? profile.focusAreas : AREAS.slice(0, 4).map((a) => a.key);
  const [done, setDone] = useState<Set<AreaKey>>(new Set());
  const pop = useRef(new Animated.Value(0)).current;
  const started = done.size > 0;

  useEffect(() => setReady(started), [started, setReady]);
  useEffect(() => {
    if (started) Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  }, [started, pop]);

  const toggle = (k: AreaKey) => {
    tick();
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      if (prev.size === 0 && next.size === 1) celebrate();
      return next;
    });
  };

  return (
    <View style={s.gap}>
      <Eyebrow>Step 2 {'✦'} every day</Eyebrow>
      <Headline before="show up in " highlight="30 seconds" after="." size={40} />
      <Sub>Each day, tap the areas you did something for. Even something small counts. Try it now.</Sub>
      <Card style={s.gap}>
        <Eyebrow>Where did you show up today?</Eyebrow>
        <View style={s.chips}>
          {areas.map((k) => (
            <Chip key={k} label={labelOf(k)} selected={done.has(k)} onToggle={() => toggle(k)} />
          ))}
        </View>
      </Card>
      <Animated.View style={{ opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }}>
        <Card dark style={s.row}>
          <Text style={s.bigLime}>1</Text>
          <View style={s.flex}>
            <Eyebrow style={{ color: colors.lime }}>Day streak</Eyebrow>
            <Text style={s.light}>That's day one. Keep it going and watch it grow.</Text>
          </View>
        </Card>
      </Animated.View>
    </View>
  );
}

/* 5. Life score, live */
const MOOD = (n: number) => (n >= 8 ? 'thriving' : n >= 5 ? 'doing okay' : 'needs some love');
export function Score({ profile, setReady }: StepProps) {
  const area = profile.focusAreas[0] ?? 'health';
  const [score, setScore] = useState<number | null>(null);
  useEffect(() => setReady(score !== null), [score, setReady]);
  return (
    <View style={s.gap}>
      <Eyebrow>Step 3 {'✦'} once a month</Eyebrow>
      <Headline before="watch your life score " highlight="grow" after="." size={40} />
      <Sub>{`Once a month you score each area from 1 to 10. Try it: how is ${labelOf(area)} going right now?`}</Sub>
      <View style={s.scoreRow}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`Score ${n}`}
            accessibilityState={{ selected: score === n }}
            onPress={() => {
              tick();
              setScore(n);
            }}
            style={[s.scoreBtn, score === n && { backgroundColor: scoreColor(n) }]}
          >
            <Text style={s.scoreTxt}>{n}</Text>
          </Pressable>
        ))}
      </View>
      {score !== null ? (
        <Card style={[s.row, { backgroundColor: scoreColor(score) }]}>
          <Text style={s.bigInk}>{score}</Text>
          <View style={s.flex}>
            <Eyebrow>{labelOf(area)}</Eyebrow>
            <Text style={s.body}>{`${MOOD(score)}. Your life score is the average of all 10 areas, and you'll see it rise month by month.`}</Text>
          </View>
        </Card>
      ) : (
        <Text style={s.mono}>Green is 8+, yellow 5 to 7, pink 4 or below</Text>
      )}
    </View>
  );
}

/* 6. Reflect */
const PROMPTS = [
  { key: 'week', eyebrow: 'Weekly reset', q: 'Did I do what I set out to do?', more: 'Score your week 1 to 10, name your win, what got in the way, and your top 3 for next week.' },
  { key: 'month', eyebrow: 'Monthly check-in', q: 'Where did I see God move?', more: 'Alongside your scores: your biggest win of the month and your focus for the next one.' },
] as const;
export function Reflect({ setReady }: StepProps) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  useEffect(() => setReady(open.size > 0), [open, setReady]);
  return (
    <View style={s.gap}>
      <Eyebrow>Step 4 {'✦'} look back</Eyebrow>
      <Headline before="reflect, don't " highlight="spiral" after="." size={40} />
      <Sub>Short prompts that help you notice what's working. Tap a card to open it.</Sub>
      {PROMPTS.map((p) => {
        const isOpen = open.has(p.key);
        return (
          <Pressable
            key={p.key}
            accessibilityRole="button"
            accessibilityState={{ expanded: isOpen }}
            onPress={() => {
              tick();
              setOpen((prev) => new Set(prev).add(p.key));
            }}
          >
            <Card style={[s.gapSm, isOpen && { backgroundColor: colors.lime }]}>
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <Text style={s.serifQ}>{p.q}</Text>
              {isOpen ? <Text style={s.body}>{p.more}</Text> : <Text style={s.mono}>Tap to open {'→'}</Text>}
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
}

/* 7. Win board */
const SAMPLE_WINS = ['Drank my water all day', 'Finally sent that email', 'Said no to something that drained me'];
export function Wins({ profile, update, setReady }: StepProps) {
  const [draft, setDraft] = useState('');
  useEffect(() => setReady(profile.firstWin.length > 0), [profile.firstWin, setReady]);
  const add = (w: string) => {
    if (!w.trim()) return;
    celebrate();
    update({ firstWin: w.trim() });
    setDraft('');
  };
  return (
    <View style={s.gap}>
      <Eyebrow>Step 5 {'✦'} celebrate</Eyebrow>
      <Headline before="keep the " highlight="proof" after="." size={40} />
      <Sub>Every win lands on your board, so on the tough days you can see how far you've come. Add your first one.</Sub>
      <View style={s.chips}>
        {SAMPLE_WINS.map((w) => (
          <Chip key={w} label={w} selected={profile.firstWin === w} onToggle={() => add(w)} />
        ))}
      </View>
      <View style={s.row}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => add(draft)}
          placeholder="Or write your own"
          placeholderTextColor="#8a8a80"
          returnKeyType="done"
          style={[s.input, s.flex, { fontSize: 17 }]}
          accessibilityLabel="Write your own win"
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Add win" onPress={() => add(draft)} style={s.addBtn}>
          <Text style={s.addTxt}>+</Text>
        </Pressable>
      </View>
      {profile.firstWin ? (
        <Card style={[s.gapSm, { backgroundColor: colors.lime }]}>
          <Eyebrow>Tough day? Remember this one</Eyebrow>
          <Text style={s.serifQ}>{profile.firstWin}</Text>
          <Text style={s.mono}>Win #1 {'✦'} today</Text>
        </Card>
      ) : null}
    </View>
  );
}

/* 8. Dream you */
const HORIZONS = [
  { key: 'y1', label: '1 year', note: 'Close and real' },
  { key: 'y3', label: '3 years', note: 'Stretching' },
  { key: 'y5', label: '5 years', note: 'The full dream' },
] as const;
export function Dream({ profile, update }: StepProps) {
  const name = profile.name.trim() || 'friend';
  return (
    <View style={[s.gap, s.center]}>
      <Eyebrow style={{ color: colors.lime }}>Dream Life Activation {'✦'} premium</Eyebrow>
      <Headline before={`picture her, `} highlight={name} after="." size={40} color={colors.cream} />
      <BreathingCircle size={130} />
      <Sub light>Breathe in for 4, out for 4. Build vision boards for who you're becoming, then map a realistic first step.</Sub>
      <View style={[s.chips, { justifyContent: 'center' }]}>
        {HORIZONS.map((h) => {
          const on = profile.horizon === h.key;
          return (
            <Pressable
              key={h.key}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => {
                tick();
                update({ horizon: h.key });
              }}
              style={[s.horizon, on && { backgroundColor: colors.lime }]}
            >
              <Text style={[s.horizonLabel, on && { color: colors.ink }]}>{h.label}</Text>
              <Text style={[s.horizonNote, on && { color: colors.ink }]}>{h.note}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* 9. Reminder */
const REMINDERS: { key: Reminder; label: string; time: string }[] = [
  { key: 'morning', label: 'Morning', time: '8:00 am' },
  { key: 'midday', label: 'Midday', time: '12:00 pm' },
  { key: 'evening', label: 'Evening', time: '8:00 pm' },
  { key: 'none', label: 'No reminders', time: "I'll remember" },
];
export function Remind({ profile, update }: StepProps) {
  const name = profile.name.trim();
  return (
    <View style={s.gap}>
      <Eyebrow>Last one</Eyebrow>
      <Headline before="when should we " highlight="nudge" after=" you?" size={40} />
      <Sub>One gentle reminder a day for your 30-second check-in. You can change this anytime.</Sub>
      {REMINDERS.map((r) => {
        const on = profile.reminder === r.key;
        return (
          <Pressable
            key={r.key}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => {
              tick();
              update({ reminder: r.key });
            }}
          >
            <Card style={[s.row, s.between, on && { backgroundColor: colors.lime }]}>
              <Text style={s.body}>{r.label}</Text>
              <Text style={s.mono}>{r.time}</Text>
            </Card>
          </Pressable>
        );
      })}
      {name ? <Sub>{`You're all set, ${name}. Showing up for your life is fun :)`}</Sub> : null}
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', gap: space.lg },
  bleed: { marginHorizontal: -space.md },
  gap: { gap: space.md },
  gapSm: { gap: space.sm },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  between: { justifyContent: 'space-between' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  sub: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 23, color: colors.ink },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.ink },
  light: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.cream },
  mono: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.ink },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: colors.paper,
    paddingHorizontal: space.md,
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.ink,
  },
  bigLime: { fontFamily: fonts.serif, fontSize: 64, lineHeight: 68, color: colors.lime },
  bigInk: { fontFamily: fonts.serif, fontSize: 64, lineHeight: 68, color: colors.ink },
  scoreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  scoreBtn: {
    width: tap + 4,
    height: tap + 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTxt: { fontFamily: fonts.serif, fontSize: 22, color: colors.ink },
  serifQ: { fontFamily: fonts.serifItalic, fontSize: 26, lineHeight: 30, color: colors.ink },
  addBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTxt: { fontFamily: fonts.mono, fontSize: 24, color: colors.ink },
  horizon: {
    minWidth: 96,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lime,
    alignItems: 'center',
  },
  horizonLabel: { fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.cream },
  horizonNote: { fontFamily: fonts.sans, fontSize: 12, color: colors.cream },
});
