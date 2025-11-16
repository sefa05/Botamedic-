import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { redirect } from 'next/navigation';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'default-restaurant';

export default async function AdminMenuPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin-login');
  }

  const { data: categories } = await supabase
    .from('categories')
    .eq('restaurant_id', RESTAURANT_ID)
    .order('sort_order')
    .select('*, products(*)');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Menü Yönetimi</h1>
        <p className="text-slate-500">Kategori ve ürünleri düzenleyin.</p>
      </div>
      <div className="grid gap-4">
        {categories?.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Kategori</p>
                <p className="text-xl font-semibold">{category.name}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100">Sıra: {category.sort_order}</span>
            </div>
            <div className="space-y-2">
              {category.products?.map((product) => (
                <div key={product.id} className="flex items-center justify-between text-sm border rounded-lg p-2">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-slate-500">₺{product.price.toFixed(2)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {product.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <form action="/api/categories" method="post" className="bg-white rounded-2xl border p-4 space-y-2">
        <h2 className="text-lg font-semibold">Yeni Kategori</h2>
        <input className="w-full border rounded-lg p-2" placeholder="Kategori adı" name="name" required />
        <input
          className="w-full border rounded-lg p-2"
          placeholder="Sıra"
          name="sort_order"
          type="number"
          required
        />
        <button className="bg-brand text-white px-4 py-2 rounded-lg" type="submit">
          Kaydet
        </button>
      </form>
    </div>
  );
}
