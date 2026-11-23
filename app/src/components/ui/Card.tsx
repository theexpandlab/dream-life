import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, radius, space } from '@/theme/tokens';

type Props = ViewProps & { dark?: boolean };

/** Square card with a 1px ink border. `dark` gives the ink hero card. */
export function Card({ dark, style, ...rest }: Props) {
  return <View style={[styles.card, dark && styles.dark, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.card,
    padding: space.md,
  },
  dark: { backgroundColor: colors.ink },
});
