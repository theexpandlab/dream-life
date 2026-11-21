import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';
import type { TabTriggerSlotProps } from 'expo-router/ui';

import { colors, fonts, radius, space } from '@/theme/tokens';

type Props = TabTriggerSlotProps & { label: string };

/** One button in the bottom tab bar. Active tab gets the lime pill. */
export function TabButton({ label, isFocused, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      style={styles.btn}
      {...(rest as PressableProps)}
    >
      <View style={[styles.pill, isFocused && styles.pillOn]}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  pill: {
    paddingHorizontal: space.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillOn: { backgroundColor: colors.lime, borderColor: colors.ink },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ink,
  },
});
