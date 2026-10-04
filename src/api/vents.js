import { supabase } from '@/lib/supabaseClient';

export async function listRecentVents(n) {
  const { data, error } = await supabase
    .from('vents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(n);
  if (error) throw error;
  return data;
}

export async function createVent(data) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: row, error } = await supabase
    .from('vents')
    .insert({ ...data, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return row;
}
