import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { FormMessage } from '@/components/FormMessage';
import { TextLink } from '@/components/TextLink';
import { PillButton, TextField } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { TEST_MODE } from '@/lib/testMode';
import { space } from '@/theme/tokens';

export default function SignInScreen() {
  // Open test mode has no accounts: anyone landing here goes straight into the app.
  if (TEST_MODE) return <Redirect href="/" />;
  return <SignIn />;
}

function SignIn() {
  const { signIn, sendReset } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();

  const submit = async () => {
    setError(undefined);
    setInfo(undefined);
    if (!email.trim() || !password) return setError('Enter your email and password.');
    setBusy(true);
    const res = await signIn(email, password);
    setBusy(false);
    if (res.error) setError(res.error);
  };

  const forgot = async () => {
    setError(undefined);
    setInfo(undefined);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Type your email above first, then tap Forgot password.');
    const res = await sendReset(email);
    if (res.error) setError(res.error);
    else setInfo(`If there's an account for ${email.trim()}, a reset link is on its way.`);
  };

  return (
    <AuthShell eyebrow="Welcome back" before="good to see " highlight="you" after=" again." sub="Log in to pick up right where you left off.">
      <View style={styles.form}>
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
          label="Password"
          password
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setError(undefined);
          }}
          autoComplete="current-password"
          textContentType="password"
          onSubmitEditing={submit}
        />
        <FormMessage text={error} tone="bad" />
        <FormMessage text={info} tone="good" />
        <PillButton label={busy ? 'Logging in...' : 'Log in'} onPress={submit} disabled={busy} />
        <TextLink label="Forgot password?" onPress={forgot} />
        <TextLink label="New here? Create an account" onPress={() => router.replace('/sign-up')} />
        <TextLink label="Take the tour first" onPress={() => router.replace('/onboarding')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({ form: { gap: space.md } });
