import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} style={styles.hit}>
      <Text style={styles.txt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { minHeight: 44, justifyContent: 'center', alignSelf: 'center' },
  txt: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.ink, textDecorationLine: 'underline' },
});
