'use client';

import { useEffect } from 'react';
import { useCart, calculateTotals } from '@/components/public/cart-context';
import { useState } from 'react';

interface Address {
  id: string;
  title: string;
  full_address: string;
  phone: string;
}

export default function CheckoutForm({ addresses, deliveryFee }: { addresses: Address[]; deliveryFee: number }) {
  const { state, clear, setDeliveryFee } = useCart();
  useEffect(() => {
    setDeliveryFee(deliveryFee);
  }, [deliveryFee, setDeliveryFee]);
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? '');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [note, setNote] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const { total, subtotal } = calculateTotals(state);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId,
          paymentMethod,
          note,
          items: state.items
        })
      });
      if (!response.ok) throw new Error('Sipariş oluşturulamadı');
      clear();
      alert('Siparişiniz alındı!');
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Adres Seçin</h2>
        {addresses.length > 0 ? (
          <select
            className="w-full mt-2 border rounded-lg p-2"
            value={addressId}
            onChange={(e) => setAddressId(e.target.value)}
          >
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.title} - {address.full_address}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-rose-500 mt-2">
            Kayıtlı adresiniz yok. Lütfen profilinizden adres ekleyin.
          </p>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold">Ödeme Tipi</h2>
        <div className="flex gap-4 mt-2">
          {['cash', 'card'].map((method) => (
            <label key={method} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method as 'cash' | 'card')}
              />
              {method === 'cash' ? 'Kapıda Nakit' : 'Kapıda Kart'}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Not</h2>
        <textarea
          className="w-full border rounded-lg p-2"
          placeholder="Özel istekleriniz..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
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
      <button
        className="w-full bg-brand text-white py-3 rounded-xl"
        disabled={isSubmitting || !addressId}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Siparişi Gönder'}
      </button>
    </div>
  );
}
