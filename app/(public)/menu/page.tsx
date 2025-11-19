import { getMenu } from '@/lib/queries';
import { ProductCard } from '@/components/public/product-card';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'default-restaurant';

export default async function MenuPage() {
  const categories = await getMenu(RESTAURANT_ID);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Menü</h1>
        <p className="text-slate-500">Kategoriye göre filtrelenmiş ürünler.</p>
      </div>
      {categories.map((category) => (
        <section key={category.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{category.name}</h2>
            <span className="text-sm text-slate-400">{category.products?.length ?? 0} ürün</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {category.products
              ?.filter((product) => product.is_active)
              .map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
