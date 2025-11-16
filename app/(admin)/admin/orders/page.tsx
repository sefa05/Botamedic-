import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';
import { OrderStatusBadge } from '@/components/admin/order-status-badge';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'default-restaurant';

export default async function AdminOrdersPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin-login');
  }

  const { data: orders } = await supabase
    .from('orders')
    .eq('restaurant_id', RESTAURANT_ID)
    .order('created_at', { ascending: false })
    .select('*, customers(full_name, phone), addresses(*), order_items(*, products(name))');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Sipariş Yönetimi</h1>
        <p className="text-slate-500">Durumları güncelleyin ve detayları inceleyin.</p>
      </div>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Sipariş #{order.id.slice(0, 6)}</p>
                <p className="font-semibold">₺{order.total_amount.toFixed(2)}</p>
              </div>
              <OrderStatusBadge status={order.status as any} />
            </div>
            <p className="text-sm">Müşteri: {order.customers?.full_name ?? 'Anonim'}</p>
            <p className="text-sm text-slate-500">Adres: {order.addresses?.full_address}</p>
            <form className="flex items-center gap-2 text-sm" action={`/api/orders/${order.id}/status`} method="post">
              <select name="status" defaultValue={order.status} className="border rounded-lg p-2">
                <option value="new">Yeni</option>
                <option value="preparing">Hazırlanıyor</option>
                <option value="on_the_way">Yolda</option>
                <option value="delivered">Teslim edildi</option>
                <option value="cancelled">İptal</option>
              </select>
              <button type="submit" className="bg-brand text-white px-3 py-1.5 rounded-lg">
                Güncelle
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
