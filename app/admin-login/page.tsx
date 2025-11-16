import AdminLoginForm from './signin-form';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Admin Girişi</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
