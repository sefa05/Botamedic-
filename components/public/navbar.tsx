'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/menu', label: 'Menü' },
  { href: '/orders', label: 'Siparişlerim' }
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-semibold text-brand">
          RestApp
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-2 py-1 rounded-md transition-colors hover:text-brand',
                pathname === link.href && 'text-brand bg-brand/10'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/checkout" className="bg-brand text-white px-3 py-1.5 rounded-md">
            Sepet
          </Link>
        </nav>
      </div>
    </header>
  );
}
