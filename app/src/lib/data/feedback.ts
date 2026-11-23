import { isSupabaseConfigured, supabase } from '@/lib/supabase';

/** Sends one piece of tester feedback. Throws if it didn't send. */
export async function sendFeedback(message: string, name: string, page: string) {
  if (!isSupabaseConfigured) throw new Error('not configured');
  const { error } = await supabase.from('feedback').insert({ message: message.trim(), name: name.trim(), page });
  if (error) throw error;
}
