import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, space, tap } from '@/theme/tokens';

type Props = { label: string; selected?: boolean; onToggle?: () => void };

/** Toggleable pill chip, e.g. the area chips in the daily check-in. */
export function Chip({ label, selected = false, onToggle }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onToggle}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: tap,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.lime },
  label: { fontFamily: fonts.sans, fontSize: 15, color: colors.ink },
});
