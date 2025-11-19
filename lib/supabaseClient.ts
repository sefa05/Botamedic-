import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const DEFAULT_SUPABASE_URL = 'https://aeapygqxgdeduptwjekp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYXB5Z3F4Z2RlZHVwdHdqZWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTU0NjEsImV4cCI6MjA3NjQzMTQ2MX0.Z-18aLcb-jjs4oMOqAvCm4-8DXIR6KLkpsTfRTvUYmU';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  DEFAULT_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase ortam değişkenleri eksik.');
}

export const createSupabaseBrowserClient = () =>
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true
    }
  });

export type SupabaseBrowserClient = ReturnType<typeof createSupabaseBrowserClient>;
