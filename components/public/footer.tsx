export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm">
        <p>© {new Date().getFullYear()} RestApp. Tüm hakları saklıdır.</p>
        <p className="text-slate-400">Supabase & Next.js ile güçlendirildi.</p>
      </div>
    </footer>
  );
}
