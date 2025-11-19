import { ReactNode } from 'react';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
