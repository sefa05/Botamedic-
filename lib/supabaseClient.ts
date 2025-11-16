import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

export const createSupabaseBrowserClient = () =>
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true
    }
  });

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

  const key = accessToken ? supabaseAnonKey : supabaseServiceKey ?? supabaseAnonKey;

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
