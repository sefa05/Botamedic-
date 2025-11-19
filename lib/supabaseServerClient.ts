import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
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

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase ortam değişkenleri eksik.');
}

const projectRef = (() => {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    return hostname.split('.')[0];
  } catch {
    return '';
  }
})();

const authCookieName = projectRef ? `sb-${projectRef}-auth-token` : undefined;

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  let accessToken: string | undefined;

  if (authCookieName) {
    const raw = cookieStore.get(authCookieName)?.value;
    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        accessToken =
          parsed?.currentSession?.access_token ?? parsed?.access_token ?? undefined;
      } catch {
        accessToken = undefined;
      }
    }
  }

  const key = accessToken ? supabaseAnonKey : supabaseServiceKey;

  return createClient<Database>(supabaseUrl, key, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      : undefined
  });
};
