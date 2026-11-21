import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { FormMessage } from '@/components/FormMessage';
import { TextLink } from '@/components/TextLink';
import { PillButton, TextField } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useOnboarding } from '@/lib/onboarding';
import { space } from '@/theme/tokens';

export default function SignUp() {
  const { signUp } = useAuth();
  const { profile, update } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();
  const name = profile.name.trim();

  const submit = async () => {
    setError(undefined);
    setInfo(undefined);
    if (!name) return setError('Add your first name.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Passwords need at least 8 characters.');
    setBusy(true);
    const res = await signUp(email, password, name);
    setBusy(false);
    if (res.error) return setError(res.error);
    if (res.needsConfirmation) setInfo(`Almost there. We sent a link to ${email.trim()}. Tap it, then come back and log in.`);
    // With a session, the app moves to Home automatically.
  };

  return (
    <AuthShell
      eyebrow="Save your progress"
      before="create your "
      highlight="account"
      after="."
      sub="So your check-ins, scores and wins are here every time you come back, on any device."
    >
      <View style={styles.form}>
        {!profile.done || !name ? (
          <TextField label="First name" value={profile.name} onChangeText={(n) => update({ name: n })} autoCapitalize="words" autoComplete="given-name" />
        ) : null}
        <TextField
          label="Email"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError(undefined);
          }}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />
        <TextField
          label="Create a password"
          password
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setError(undefined);
          }}
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="At least 8 characters"
          onSubmitEditing={submit}
        />
        <FormMessage text={error} tone="bad" />
        <FormMessage text={info} tone="good" />
        <PillButton label={busy ? 'Creating...' : 'Create my account'} onPress={submit} disabled={busy} />
        <TextLink label="I already have an account" onPress={() => router.replace('/sign-in')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({ form: { gap: space.md } });
