import { supabase } from '@/lib/supabaseClient';

// Deletes the signed-in user's account. The database cascades this to their
// profile, daily logs and vents (supabase/migrations/0002_delete_own_account.sql).
export async function deleteOwnAccount() {
  const { error } = await supabase.rpc('delete_own_account');
  if (error) throw error;
}
