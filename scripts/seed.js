import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SECRET_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY (see .env.example) before running this script.');
  process.exit(1);
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.error('Usage: node --env-file=.env scripts/seed.js <user-email> [password]');
  console.error('If the account does not exist yet, it is created (email pre-confirmed) with the given');
  console.error('password, or a randomly generated one if none is given.');
  process.exit(1);
}
const providedPassword = process.argv[3];

const supabase = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Two weeks of realistic, gentle sample entries (most recent first) — good enough
// for App Store screenshots and the App Review demo account. Mood values match
// the MOODS list in src/components/calendar/DailyLogModal.jsx.
const SAMPLE_DAYS = [
  { moods: [14, 11], journal: 'Slept well for the first time in a while. Sat outside with my tea this morning and just noticed the light.', alternatives: ['Went for a walk', 'Listened to music'] },
  { moods: [13], journal: null, alternatives: ['Deep breathing'] },
  { moods: [15, 12], journal: 'Called Sam tonight. I didn\'t realise how much I needed to hear a friendly voice.', alternatives: ['Called a friend'] },
  { moods: [10], journal: null, alternatives: [] },
  { moods: [22, 10], journal: 'Long day. Tired, but I got through it, and that counts.', alternatives: ['Took a bath'] },
  { moods: [11], journal: null, alternatives: ['Meditated', 'Journaled'] },
  { moods: [4, 9], journal: 'Felt anxious before work. Did the box breathing on the bus and it took the edge off.', alternatives: ['Deep breathing'] },
  { moods: [16], journal: 'Finished the drawing I started last week. Small win, but I\'m proud of it.', alternatives: ['Art or crafts'] },
  { moods: [8, 5], journal: null, alternatives: ['Listened to music', 'Held ice'] },
  { moods: [5], journal: 'Quiet day. Missing people. Wrote it all down instead of keeping it in.', alternatives: ['Journaled'] },
  { moods: [10, 22], journal: null, alternatives: ['Watched a movie'] },
  { moods: [4], journal: 'Couldn\'t settle tonight. Played the memory game until my head felt quieter.', alternatives: ['Played a game'] },
  { moods: [8], journal: null, alternatives: ['Went for a walk'] },
  { moods: [9, 4], journal: 'Starting this journal. Not sure what to write yet — just showing up.', alternatives: [] },
];

async function findOrCreateUser(email, password) {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  const existing = data.users.find((u) => u.email === email);
  if (existing) {
    console.log(`Using existing account ${email}.`);
    return existing.id;
  }

  const finalPassword = password || crypto.randomBytes(12).toString('base64url');
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: finalPassword,
    email_confirm: true,
  });
  if (createError) throw createError;
  console.log(`Created test account ${email} (password: ${finalPassword}) — save this, it won't be shown again.`);
  return created.user.id;
}

async function seed() {
  const userId = await findOrCreateUser(targetEmail, providedPassword);

  const dailyLogs = SAMPLE_DAYS.map((day, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      user_id: userId,
      date: date.toISOString().slice(0, 10),
      moods: day.moods,
      self_harmed: false,
      journal: day.journal,
      alternatives_used: day.alternatives,
    };
  });

  const vents = [
    { user_id: userId, content: 'Everything feels like too much today. I just needed to put it somewhere.', anonymous_name: 'Anonymous' },
    { user_id: userId, content: 'Better than this morning. Breathing helped more than I expected.', anonymous_name: 'Anonymous' },
  ];

  // upsert, not insert: daily_logs has a (user_id, date) uniqueness constraint,
  // so re-running this script against an account that already has sample data
  // for today's date range would otherwise fail on a duplicate-key error.
  const { error: logsError } = await supabase
    .from('daily_logs')
    .upsert(dailyLogs, { onConflict: 'user_id,date' });
  if (logsError) throw logsError;

  const { error: ventsError } = await supabase.from('vents').insert(vents);
  if (ventsError) throw ventsError;

  console.log(`Seeded ${dailyLogs.length} daily logs and ${vents.length} vents for ${targetEmail}.`);
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
