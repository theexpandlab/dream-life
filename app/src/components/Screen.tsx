import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, space } from '@/theme/tokens';

type Props = {
  /** Fixed content above the scroll area, e.g. a section switcher. */
  top?: ReactNode;
  children: ReactNode;
};

/** Standard tab screen: cream background, safe area, scrolling body. */
export function Screen({ top, children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {top ? <View style={styles.top}>{top}</View> : null}
      <ScrollView contentContainerStyle={styles.scroll}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, minHeight: 0, backgroundColor: colors.cream },
  top: { paddingTop: space.md, paddingBottom: space.sm },
  scroll: { paddingTop: space.md, paddingBottom: space.xl, gap: space.lg },
});
