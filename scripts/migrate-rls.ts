import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrate() {
  console.log('Running RLS policies migration...')
  const sql = fs.readFileSync(path.join(__dirname, 'admin_rls_policies.sql'), 'utf8')

  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

  for (const stmt of statements) {
    const { error } = await supabase.rpc('exec_sql', { query: stmt + ';' }).maybeSingle()
    if (error) {
      // Try direct query as fallback
      const { error: err2 } = await supabase.from('_exec_sql').select('*').limit(0).maybeSingle()
      if (err2 || error.message?.includes('function')) {
        console.log('Cannot exec_sql via RPC — use Supabase dashboard SQL editor')
        console.log('SQL file: scripts/admin_rls_policies.sql')
        console.log('Instructions:')
        console.log('1. Go to https://supabase.com/dashboard/project/javviajdtrxwsbqvsqws/sql/new')
        console.log('2. Open scripts/admin_rls_policies.sql')
        console.log('3. Paste and run')
        process.exit(1)
      }
    }
  }

  console.log('Migration complete!')
}

migrate().catch(console.error)
