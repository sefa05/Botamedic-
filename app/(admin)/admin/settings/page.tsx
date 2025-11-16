import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'default-restaurant';

export default async function AdminSettingsPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin-login');
  }

  const { data: restaurantData } = await supabase.from('restaurants').eq('id', RESTAURANT_ID).select('*');
  const restaurant = Array.isArray(restaurantData) ? restaurantData[0] : restaurantData;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Restoran Ayarları</h1>
        <p className="text-slate-500">Çalışma saatleri ve sipariş kurallarını düzenleyin.</p>
      </div>
      <form action="/api/restaurants" method="post" className="bg-white rounded-2xl border p-4 grid gap-4">
        <input type="hidden" name="id" value={restaurant?.id} />
        <label className="text-sm">
          Restoran Adı
          <input className="w-full border rounded-lg p-2" name="name" defaultValue={restaurant?.name} />
        </label>
        <label className="text-sm">
          Minimum Sepet (₺)
          <input
            className="w-full border rounded-lg p-2"
            type="number"
            name="min_order_amount"
            defaultValue={restaurant?.min_order_amount}
          />
        </label>
        <label className="text-sm">
          Teslimat Ücreti (₺)
          <input
            className="w-full border rounded-lg p-2"
            type="number"
            name="delivery_fee"
            defaultValue={restaurant?.delivery_fee}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_open" defaultChecked={restaurant?.is_open} />
          Restoran açık
        </label>
        <button className="bg-brand text-white px-4 py-2 rounded-lg" type="submit">
          Kaydet
        </button>
      </form>
    </div>
  );
}
