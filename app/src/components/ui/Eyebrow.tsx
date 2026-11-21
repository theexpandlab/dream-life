import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

/** Monospace, uppercase, letter-spaced label. */
export function Eyebrow({ style, ...rest }: TextProps) {
  return <Text style={[styles.eyebrow, style]} {...rest} />;
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.ink,
  },
});
