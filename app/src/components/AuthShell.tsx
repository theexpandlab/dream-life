import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Eyebrow, Headline } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { colors, fonts, space } from '@/theme/tokens';

type Props = { eyebrow: string; before: string; highlight: string; after?: string; sub?: string; children: ReactNode };

export function AuthShell({ eyebrow, before, highlight, after, sub, children }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.head}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Headline before={before} highlight={highlight} after={after} size={40} />
            {sub ? <Text style={styles.sub}>{sub}</Text> : null}
          </View>
          {!isSupabaseConfigured ? (
            <Text style={styles.warn}>Accounts are not connected yet. Add the Supabase keys to app/.env (see SUPABASE_SETUP.md).</Text>
          ) : null}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, minHeight: 0, backgroundColor: colors.cream },
  flex: { flex: 1, minHeight: 0 },
  body: { flexGrow: 1, padding: space.md, paddingTop: space.xl, gap: space.lg },
  head: { gap: space.sm },
  sub: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 23, color: colors.ink },
  warn: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.bad, borderWidth: 1, borderColor: colors.bad, padding: space.sm },
});
