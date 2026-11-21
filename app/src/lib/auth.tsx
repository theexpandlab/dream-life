import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type Result = { error?: string; needsConfirmation?: boolean };

type Ctx = {
  loaded: boolean;
  session: Session | null;
  signUp: (email: string, password: string, name: string) => Promise<Result>;
  signIn: (email: string, password: string) => Promise<Result>;
  sendReset: (email: string) => Promise<Result>;
  setNewPassword: (password: string) => Promise<Result>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

/** Turns Supabase error text into friendly, on-brand copy. */
function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return "That email and password don't match. Try again, or reset your password.";
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'You already have an account with that email. Log in instead.';
  if (m.includes('email not confirmed')) return 'Check your inbox and tap the confirmation link first.';
  if (m.includes('password')) return 'Passwords need at least 8 characters.';
  if (m.includes('rate limit')) return 'Too many tries. Wait a minute and try again.';
  if (m.includes('fetch') || m.includes('network')) return "We couldn't reach the server. Check your connection.";
  return message;
}

const NOT_READY = 'Accounts are not connected yet. Add the Supabase keys (see SUPABASE_SETUP.md).';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(!isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setLoaded(true));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      loaded,
      session,
      async signUp(email, password, name) {
        if (!isSupabaseConfigured) return { error: NOT_READY };
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) return { error: friendly(error.message) };
        // With "Confirm email" switched on in Supabase there is no session until they tap the link.
        return { needsConfirmation: !data.session };
      },
      async signIn(email, password) {
        if (!isSupabaseConfigured) return { error: NOT_READY };
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        return error ? { error: friendly(error.message) } : {};
      },
      async sendReset(email) {
        if (!isSupabaseConfigured) return { error: NOT_READY };
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        return error ? { error: friendly(error.message) } : {};
      },
      async setNewPassword(password) {
        const { error } = await supabase.auth.updateUser({ password });
        return error ? { error: friendly(error.message) } : {};
      },
      async signOut() {
        await supabase.auth.signOut();
      },
    }),
    [loaded, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
