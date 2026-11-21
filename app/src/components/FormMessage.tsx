import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

export function FormMessage({ text, tone }: { text?: string; tone: 'good' | 'bad' }) {
  if (!text) return null;
  return (
    <Text accessibilityLiveRegion="polite" style={[styles.msg, { color: colors[tone] }]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({ msg: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21 } });
