const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};

module.exports = { getSupabaseClient };
