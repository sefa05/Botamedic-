'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Siparişler' },
  { href: '/admin/menu', label: 'Menü Yönetimi' },
  { href: '/admin/settings', label: 'Ayarlar' }
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-white border-r min-h-screen p-4 space-y-4">
      <div>
        <p className="text-sm uppercase text-slate-400">Restoran</p>
        <p className="text-lg font-semibold">Yönetim Paneli</p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              'rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand/10',
              pathname === link.href ? 'bg-brand text-white hover:bg-brand' : 'text-slate-700'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
