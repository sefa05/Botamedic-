/** @type {import('next').NextConfig} */
const DEFAULT_SUPABASE_URL = 'https://aeapygqxgdeduptwjekp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYXB5Z3F4Z2RlZHVwdHdqZWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTU0NjEsImV4cCI6MjA3NjQzMTQ2MX0.Z-18aLcb-jjs4oMOqAvCm4-8DXIR6KLkpsTfRTvUYmU';

const nextConfig = {
  experimental: {
    serverActions: true
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      process.env.VITE_SUPABASE_URL ??
      DEFAULT_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.VITE_SUPABASE_ANON_KEY ??
      DEFAULT_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_RESTAURANT_ID:
      process.env.NEXT_PUBLIC_RESTAURANT_ID ?? process.env.VITE_RESTAURANT_ID ?? ''
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;
