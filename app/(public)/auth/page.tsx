import AuthForm from './supabase-auth-form';

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border shadow-sm p-6">
      <h1 className="text-2xl font-semibold mb-4">Giriş / Kayıt</h1>
      <AuthForm />
    </div>
  );
}
