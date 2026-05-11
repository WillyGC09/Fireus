import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://diuejfsjcijnkhfmgeml.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_koNA-DtsKWHncKcljZdUmw_DtIQksM3'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)