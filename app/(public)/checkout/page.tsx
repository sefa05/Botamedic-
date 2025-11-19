import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import CheckoutForm from './checkout-form';
import { getRestaurant } from '@/lib/queries';

export default async function CheckoutPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const { data: addresses } = await supabase.from('addresses').eq('customer_id', user.id).select('*');
  const restaurant = await getRestaurant(process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'default-restaurant');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Siparişi Tamamla</h1>
        <p className="text-slate-500">Adres ve ödeme tercihinizi seçin.</p>
      </div>
      <CheckoutForm addresses={addresses ?? []} deliveryFee={restaurant.delivery_fee} />
    </div>
  );
}
