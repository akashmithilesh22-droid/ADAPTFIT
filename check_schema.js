const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key) acc[key] = val.join('=').trim();
  return acc;
}, {});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log("Checking workouts table...");
  const { data: workouts, error: wErr } = await supabase.from('workouts').select('*').limit(1);
  console.log("workouts:", wErr ? wErr.message : "Exists");

  console.log("Checking user_stats table...");
  const { data: stats, error: sErr } = await supabase.from('user_stats').select('*').limit(1);
  console.log("user_stats:", sErr ? sErr.message : "Exists");

  console.log("Checking completed_workouts table...");
  const { data: cw, error: cwErr } = await supabase.from('completed_workouts').select('*').limit(1);
  console.log("completed_workouts:", cwErr ? cwErr.message : "Exists");

  console.log("Checking workout_history table...");
  const { data: wh, error: whErr } = await supabase.from('workout_history').select('*').limit(1);
  console.log("workout_history:", whErr ? whErr.message : "Exists");
}

checkSchema();
