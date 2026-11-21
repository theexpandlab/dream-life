import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { FormMessage } from '@/components/FormMessage';
import { PillButton, TextField } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { space } from '@/theme/tokens';

/** Opened from the password reset email (web). */
export default function ResetPassword() {
  const { session, setNewPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (password.length < 8) return setError('Passwords need at least 8 characters.');
    setBusy(true);
    const res = await setNewPassword(password);
    setBusy(false);
    if (res.error) return setError(res.error);
    router.replace('/home');
  };

  return (
    <AuthShell eyebrow="Reset password" before="choose a new " highlight="password" after=".">
      <View style={styles.form}>
        {!session ? <FormMessage tone="bad" text="This link has expired. Request a new one from the log in screen." /> : null}
        <TextField label="New password" password value={password} onChangeText={setPassword} autoComplete="new-password" textContentType="newPassword" />
        <FormMessage text={error} tone="bad" />
        <PillButton label={busy ? 'Saving...' : 'Save new password'} onPress={submit} disabled={busy || !session} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({ form: { gap: space.md } });
