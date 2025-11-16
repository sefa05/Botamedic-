import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6">{children}</main>
    </div>
  );
}
