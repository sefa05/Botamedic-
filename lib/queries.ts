import { cache } from 'react';
import { createSupabaseServerClient } from './supabaseServerClient';

export const getRestaurant = cache(async (restaurantId: string) => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('restaurants').eq('id', restaurantId).select('*');
  if (error) throw error;
  const restaurant = Array.isArray(data) ? data[0] : data;
  if (!restaurant) throw new Error('Restaurant not found');
  return restaurant;
});

export const getMenu = cache(async (restaurantId: string) => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('sort_order')
    .select(
      `id,name,sort_order,products:products(id,name,description,price,discounted_price,image_url,is_active,product_options(*,product_option_values(*)))`
    );
  if (error) throw error;
  return data;
});

export type MenuCategory = Awaited<ReturnType<typeof getMenu>>[number];
