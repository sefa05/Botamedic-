import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('orders')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .select('*, order_items(*, order_item_options(*)), addresses(*)');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const body = await request.json();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: restaurantRows } = await supabase
    .from('restaurants')
    .eq('id', process.env.NEXT_PUBLIC_RESTAURANT_ID)
    .select('*');

  const restaurant = Array.isArray(restaurantRows) ? restaurantRows[0] : restaurantRows;
  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not configured' }, { status: 400 });
  }

  const subtotal = body.items.reduce((sum: number, item: any) => {
    const optionsTotal = item.options.reduce((acc: number, option: any) => acc + option.extra_price, 0);
    return sum + (item.price + optionsTotal) * item.quantity;
  }, 0);

  const total = subtotal + (restaurant?.delivery_fee ?? 0);

  const { data, error } = await supabase
    .from('orders')
    .insert({
      restaurant_id: process.env.NEXT_PUBLIC_RESTAURANT_ID,
      customer_id: user.id,
      address_id: body.addressId,
      status: 'new',
      payment_method: body.paymentMethod,
      subtotal_amount: subtotal,
      delivery_fee: restaurant?.delivery_fee ?? 0,
      total_amount: total,
      customer_note: body.note
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const order = Array.isArray(data) ? data[0] : data;

  for (const item of body.items) {
    const { data: orderItemData } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      });

    const orderItem = Array.isArray(orderItemData) ? orderItemData[0] : orderItemData;

    for (const option of item.options) {
      await supabase.from('order_item_options').insert({
        order_item_id: orderItem?.id,
        option_value_id: option.id,
        label: option.label,
        extra_price: option.extra_price
      });
    }
  }

  return NextResponse.json(order, { status: 201 });
}
