import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FormMessage } from '@/components/FormMessage';
import { Card, Eyebrow, PillButton, TextField } from '@/components/ui';
import { sendFeedback } from '@/lib/data/feedback';
import { celebrate } from '@/lib/haptics';
import { useOnboarding } from '@/lib/onboarding';
import { colors, fonts, space } from '@/theme/tokens';

/** Lets testers tell Hannah what they think. Lands in the Supabase "feedback" table. */
export function FeedbackCard({ page }: { page: string }) {
  const { profile } = useOnboarding();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'good' | 'bad'; text: string }>();

  const send = async () => {
    if (!text.trim()) return setMsg({ tone: 'bad', text: 'Write a little something first.' });
    setBusy(true);
    setMsg(undefined);
    try {
      await sendFeedback(text, profile.name, page);
      celebrate();
      setText('');
      setMsg({ tone: 'good', text: 'Sent. Thank you, this helps so much ✦' });
    } catch {
      setMsg({ tone: 'bad', text: "That didn't send. Try again in a moment." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.pad}>
      <Card style={[styles.gap, { backgroundColor: colors.yellow }]}>
        <Eyebrow>You're testing Dream Life</Eyebrow>
        <Text style={styles.body}>What did you love? What was confusing? Anything you wish it did?</Text>
        <TextField
          label="Your feedback"
          value={text}
          onChangeText={(v) => {
            setText(v);
            setMsg(undefined);
          }}
          multiline
          autoCapitalize="sentences"
          autoCorrect
          style={styles.area}
        />
        <PillButton label={busy ? 'Sending...' : 'Send feedback'} onPress={send} disabled={busy} />
        <FormMessage tone={msg?.tone ?? 'good'} text={msg?.text} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.md },
  gap: { gap: space.sm },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.ink },
  area: { minHeight: 96, paddingTop: 14, textAlignVertical: 'top' },
});
