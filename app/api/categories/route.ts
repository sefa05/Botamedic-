import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID ?? 'default-restaurant';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect('/admin-login');
  }

  const formData = await request.formData();
  const name = formData.get('name') as string;
  const sortOrder = Number(formData.get('sort_order'));

  const { error } = await supabase.from('categories').insert({
    name,
    sort_order: sortOrder,
    restaurant_id: RESTAURANT_ID,
    is_active: true
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect('/admin/menu');
}
