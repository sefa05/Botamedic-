'use client';

import { useEffect, useState } from 'react';
import { OrderStatusBadge } from '@/components/admin/order-status-badge';

type Order = {
  id: string;
  status: 'new' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method: string;
  addresses?: { full_address: string } | null;
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders');
      if (response.ok) {
        setOrders(await response.json());
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Sipariş #{order.id.slice(0, 6)}</p>
              <p className="font-semibold">₺{order.total_amount.toFixed(2)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm">Ödeme: {order.payment_method}</p>
          <p className="text-sm text-slate-500">Adres: {order.addresses?.full_address ?? '-'}</p>
        </div>
      ))}
    </div>
  );
}
