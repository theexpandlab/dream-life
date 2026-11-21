import { StyleSheet, Text, View } from 'react-native';

import { Eyebrow, Headline } from '@/components/ui';
import { colors, fonts, space } from '@/theme/tokens';

type Props = { eyebrow: string; before?: string; highlight: string; after?: string; sub?: string };

export function SectionHeader({ eyebrow, before, highlight, after, sub }: Props) {
  return (
    <View style={styles.wrap}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Headline before={before} highlight={highlight} after={after} size={36} />
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.md, gap: space.sm },
  sub: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.ink },
});
