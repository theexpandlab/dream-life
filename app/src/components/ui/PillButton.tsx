import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { colors, fonts, radius, space, tap } from '@/theme/tokens';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary';
};

/** Pill button: 1px ink border, lime fill for primary, mono uppercase label. */
export function PillButton({ label, variant = 'primary', style, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={(state) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: tap,
    paddingHorizontal: space.lg,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.lime },
  secondary: { backgroundColor: colors.paper },
  pressed: { opacity: 0.7 },
  label: { fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1.5, color: colors.ink },
});
