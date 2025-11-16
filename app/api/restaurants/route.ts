import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect('/admin-login');
  }

  const formData = await request.formData();
  const id = formData.get('id') as string;
  const payload = {
    name: formData.get('name') as string,
    min_order_amount: Number(formData.get('min_order_amount')),
    delivery_fee: Number(formData.get('delivery_fee')),
    is_open: formData.get('is_open') === 'on'
  };

  const { error } = await supabase.from('restaurants').update(payload).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect('/admin/settings');
}
