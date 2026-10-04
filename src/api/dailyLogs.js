import { supabase } from '@/lib/supabaseClient';

export async function listDailyLogs() {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .order('date', { ascending: false })
    .limit(500);
  if (error) throw error;
  return data;
}

export async function createDailyLog(data) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: row, error } = await supabase
    .from('daily_logs')
    .insert({ ...data, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return row;
}

// Upserts a daily log by (user_id, date) — the database's unique constraint on that
// pair (see supabase/migrations/0002_daily_logs_unique_date.sql) makes create-vs-update
// atomic, so callers don't need to first look up whether a row for this date already
// exists (a client-side cache lookup can race: two tabs, or a save inside the
// optimistic-update window, previously could produce duplicate rows for one date).
export async function upsertDailyLog(data) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: row, error } = await supabase
    .from('daily_logs')
    .upsert({ ...data, user_id: user.id }, { onConflict: 'user_id,date' })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateDailyLog(id, data) {
  const { data: row, error } = await supabase
    .from('daily_logs')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return row;
}
