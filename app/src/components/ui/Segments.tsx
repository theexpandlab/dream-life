import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, space } from '@/theme/tokens';

type Props<K extends string> = {
  options: readonly { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
};

/** Pill switcher for sections inside a tab (e.g. Weekly / Monthly). */
export function Segments<K extends string>({ options, value, onChange }: Props<K>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.key)}
            style={[styles.seg, on && styles.on]}
          >
            <Text style={[styles.label, on && { color: colors.cream }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: space.sm, paddingHorizontal: space.md },
  seg: {
    minHeight: 40,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    justifyContent: 'center',
  },
  on: { backgroundColor: colors.ink },
  label: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.ink,
  },
});
