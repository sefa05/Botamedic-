'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { calculateTotals, useCart } from './cart-context';

export function CartSummary({ minOrder, deliveryFee }: { minOrder: number; deliveryFee: number }) {
  const { state, updateQuantity, removeItem, setDeliveryFee } = useCart();
  useEffect(() => {
    setDeliveryFee(deliveryFee);
  }, [deliveryFee, setDeliveryFee]);
  const { subtotal, total } = calculateTotals(state);
  const canCheckout = subtotal >= minOrder;

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-4">
      <h2 className="text-lg font-semibold">Sepet</h2>
      {state.items.length === 0 && <p className="text-sm text-slate-500">Sepetiniz boş.</p>}
      {state.items.map((item) => (
        <div key={item.product_id} className="border-b pb-2 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">{item.name}</p>
            <button className="text-xs text-red-500" onClick={() => removeItem(item.product_id)}>
              Sil
            </button>
          </div>
          <p className="text-slate-500">₺{item.price.toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              className="px-2 py-1 bg-slate-100 rounded"
              onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              className="px-2 py-1 bg-slate-100 rounded"
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Ara toplam</span>
          <span>₺{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Teslimat</span>
          <span>₺{state.deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Toplam</span>
          <span>₺{total.toFixed(2)}</span>
        </div>
      </div>
      <Link
        href="/checkout"
        className={`block text-center rounded-xl py-2 text-white ${
          canCheckout ? 'bg-brand' : 'bg-slate-300 cursor-not-allowed'
        }`}
        aria-disabled={!canCheckout}
      >
        Siparişi Onayla
      </Link>
      {!canCheckout && (
        <p className="text-xs text-slate-500">
          Minimum sepet tutarı ₺{minOrder.toFixed(2)}. Lütfen sepetinize ürün ekleyin.
        </p>
      )}
    </div>
  );
}
