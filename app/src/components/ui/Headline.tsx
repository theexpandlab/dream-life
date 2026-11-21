import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

type Props = {
  /** Text before the highlighted word, e.g. "your life, at a " */
  before?: string;
  /** The one italic word with the lime highlighter band. */
  highlight?: string;
  /** Text after the highlighted word. */
  after?: string;
  size?: number;
  color?: string;
};

/**
 * Lowercase serif headline with one italic word on a lime highlighter band.
 * <Headline before="your life, at a " highlight="glance" after="." />
 */
export function Headline({ before = '', highlight, after = '', size = 40, color = colors.ink }: Props) {
  const base = { fontFamily: fonts.serif, fontSize: size, lineHeight: size * 1.1, color };
  return (
    <Text accessibilityRole="header" style={base}>
      {before.toLowerCase()}
      {highlight ? (
        <Text style={[styles.mark, { fontFamily: fonts.serifItalic, color: colors.ink }]}>
          {highlight.toLowerCase()}
        </Text>
      ) : null}
      {after.toLowerCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  // Nested Text cannot take padding, so the band is the text background.
  mark: { backgroundColor: colors.lime },
});

