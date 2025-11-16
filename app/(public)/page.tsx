import { getMenu, getRestaurant } from '@/lib/queries';
import { ProductCard } from '@/components/public/product-card';
import { CartSummary } from '@/components/public/cart-summary';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'default-restaurant';

export default async function HomePage() {
  const [restaurant, categories] = await Promise.all([
    getRestaurant(RESTAURANT_ID),
    getMenu(RESTAURANT_ID)
  ]);

  return (
    <div className="space-y-10">
      <section className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div
          className="h-48 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.cover_image_url ?? ''})` }}
        />
        <div className="p-6 space-y-2">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-slate-500">{restaurant.address}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className={`px-3 py-1 rounded-full ${restaurant.is_open ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {restaurant.is_open ? 'Şu an açık' : 'Şu an kapalı'}
            </span>
            <span>Tel: {restaurant.phone}</span>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{category.name}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {category.products
                  ?.filter((product) => product.is_active)
                  .map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </div>
          ))}
        </div>
        <CartSummary minOrder={restaurant.min_order_amount} deliveryFee={restaurant.delivery_fee} />
      </section>
    </div>
  );
}
