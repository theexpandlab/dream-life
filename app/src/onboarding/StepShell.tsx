import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/ui';
import { colors, fonts, space } from '@/theme/tokens';

type Props = {
  step: number;
  total: number;
  onBack?: () => void;
  onSkip?: () => void;
  cta: string;
  onNext: () => void;
  canNext?: boolean;
  hint?: string;
  dark?: boolean;
  children: ReactNode;
};

/** Frame for every onboarding step: progress, back/skip, body, main button. */
export function StepShell({ step, total, onBack, onSkip, cta, onNext, canNext = true, hint, dark, children }: Props) {
  const fg = dark ? colors.cream : colors.ink;
  return (
    <SafeAreaView style={[styles.safe, dark && { backgroundColor: colors.ink }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topRow}>
          <Pressable onPress={onBack} disabled={!onBack} hitSlop={12} style={styles.navBtn} accessibilityRole="button" accessibilityLabel="Back">
            <Text style={[styles.nav, { color: fg, opacity: onBack ? 1 : 0 }]}>{'←'} Back</Text>
          </Pressable>
          <View style={styles.progress} accessibilityLabel={`Step ${step + 1} of ${total}`}>
            {Array.from({ length: total }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { borderColor: fg },
                  i <= step && { backgroundColor: colors.lime, borderColor: dark ? colors.lime : colors.ink },
                ]}
              />
            ))}
          </View>
          <Pressable onPress={onSkip} disabled={!onSkip} hitSlop={12} style={styles.navBtn} accessibilityRole="button" accessibilityLabel="Skip the tour">
            <Text style={[styles.nav, styles.right, { color: fg, opacity: onSkip ? 1 : 0 }]}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>

        <View style={styles.footer}>
          {hint ? <Text style={[styles.hint, { color: fg }]}>{hint}</Text> : null}
          <PillButton label={cta} onPress={onNext} disabled={!canNext} style={!canNext && styles.disabled} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, minHeight: 0, backgroundColor: colors.cream },
  flex: { flex: 1, minHeight: 0 },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, paddingTop: space.sm, gap: space.sm },
  navBtn: { minWidth: 64, minHeight: 44, justifyContent: 'center' },
  nav: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' },
  right: { textAlign: 'right' },
  progress: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1 },
  body: { flexGrow: 1, padding: space.md, paddingTop: space.lg, gap: space.lg },
  footer: { paddingHorizontal: space.md, paddingBottom: space.md, paddingTop: space.sm, gap: space.sm },
  hint: { fontFamily: fonts.sans, fontSize: 13, textAlign: 'center' },
  disabled: { opacity: 0.4 },
});
