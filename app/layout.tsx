import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { CartProvider } from '@/components/public/cart-context';

export const metadata: Metadata = {
  title: 'Botamedic White-label Restaurant',
  description: 'Tek restoran için hızlı sipariş deneyimi'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
