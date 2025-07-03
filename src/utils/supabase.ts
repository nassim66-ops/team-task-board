import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,  // Vite uses import.meta.env
  import.meta.env.VITE_SUPABASE_ANON_KEY
);