'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const fn = mode === 'sign_in' ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium">E-posta</label>
        <input
          className="w-full border rounded-lg p-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Şifre</label>
        <input
          className="w-full border rounded-lg p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="w-full bg-brand text-white py-2 rounded-xl" disabled={loading}>
        {loading ? 'Gönderiliyor...' : mode === 'sign_in' ? 'Giriş yap' : 'Kayıt ol'}
      </button>
      <button
        type="button"
        className="text-sm text-brand"
        onClick={() => setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in')}
      >
        {mode === 'sign_in' ? 'Hesabın yok mu? Kaydol' : 'Hesabın var mı? Giriş yap'}
      </button>
    </form>
  );
}
