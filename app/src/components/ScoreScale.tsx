import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tick } from '@/lib/haptics';
import { colors, fonts, radius, scoreColor, space } from '@/theme/tokens';

type Props = { label: string; value: number | null | undefined; onChange: (n: number) => void };

/** One area: label, current score, and a 1 to 10 row that fills the width. */
export function ScoreScale({ label, value, onChange }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="radiogroup" accessibilityLabel={label}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, value != null && { backgroundColor: scoreColor(value) }]}>{value ?? '–'}</Text>
      </View>
      <View style={styles.row}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const on = value === n;
          return (
            <Pressable
              key={n}
              accessibilityRole="radio"
              accessibilityLabel={`${label} ${n}`}
              accessibilityState={{ selected: on }}
              hitSlop={{ top: 6, bottom: 6 }}
              onPress={() => {
                tick();
                onChange(n);
              }}
              style={[styles.pill, on && { backgroundColor: scoreColor(n) }]}
            >
              <Text style={styles.n}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm, paddingVertical: space.sm, borderBottomWidth: 1, borderBottomColor: colors.ink },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: fonts.sans, fontSize: 16, color: colors.ink },
  value: { fontFamily: fonts.serif, fontSize: 22, minWidth: 34, textAlign: 'center', color: colors.ink, paddingHorizontal: 4 },
  row: { flexDirection: 'row', gap: 4 },
  pill: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  n: { fontFamily: fonts.mono, fontSize: 13, color: colors.ink },
});
