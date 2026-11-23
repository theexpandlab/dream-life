import { StyleSheet, Text, View } from 'react-native';

import { Card, Eyebrow } from '@/components/ui';
import { colors, fonts, space } from '@/theme/tokens';

/** Placeholder card for a section that is designed but not built yet. */
export function ComingSoon({ items }: { items: string[] }) {
  return (
    <View style={styles.pad}>
      <Card style={styles.card}>
        <Eyebrow>Coming next</Eyebrow>
        {items.map((t) => (
          <Text key={t} style={styles.item}>
            {'✦'} {t}
          </Text>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.md },
  card: { gap: space.sm },
  item: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.ink },
});
