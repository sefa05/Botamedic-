import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'default-restaurant';

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin-login');
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: orders } = await supabase
    .from('orders')
    .eq('restaurant_id', RESTAURANT_ID)
    .gte('created_at', today)
    .order('created_at', { ascending: false })
    .select('*');

  const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) ?? 0;
  const pending = orders?.filter((order) => ['new', 'preparing'].includes(order.status)) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500">Bugünkü performans özeti</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-sm text-slate-500">Bugünkü sipariş</p>
          <p className="text-3xl font-bold">{orders?.length ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-sm text-slate-500">Bugünkü ciro</p>
          <p className="text-3xl font-bold">₺{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-sm text-slate-500">Aktif sipariş</p>
          <p className="text-3xl font-bold">{pending.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border p-4">
        <h2 className="text-xl font-semibold mb-4">Bekleyen Siparişler</h2>
        <div className="space-y-2">
          {pending.map((order) => (
            <div key={order.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">Sipariş #{order.id.slice(0, 6)}</p>
                <p className="text-slate-500">₺{order.total_amount.toFixed(2)}</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">{order.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
