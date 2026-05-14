
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vqmmcvreyyibiphsdscf.supabase.co'
const supabaseKey = 'sb_publishable_7D2NxqmfLxxRa8wYVH2YjA_Lnw4RkTO'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable() {
  const { data, error } = await supabase.from('workouts').select('*').limit(1)
  if (error) {
    console.log('Error or table does not exist:', error.message)
  } else {
    console.log('Table exists, data:', data)
  }
}

checkTable()
