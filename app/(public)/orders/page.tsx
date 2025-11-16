import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import OrdersClient from './orders-client';

export default async function OrdersPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-sm text-slate-500">Sipariş geçmişini görmek için giriş yapın.</p>;
  }

  const { data: orders } = await supabase
    .from('orders')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .select('*, addresses(*)');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Siparişlerim</h1>
        <p className="text-slate-500">Aktif ve geçmiş siparişler.</p>
      </div>
      <OrdersClient initialOrders={orders ?? []} />
    </div>
  );
}
