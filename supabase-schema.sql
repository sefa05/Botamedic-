create extension if not exists "uuid-ossp";

create table public.restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  cover_image_url text,
  phone text,
  address text,
  min_order_amount numeric not null default 0,
  delivery_fee numeric not null default 0,
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric not null,
  discounted_price numeric,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_options (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  type text not null check (type in ('single','multi')),
  is_required boolean not null default false
);

create table public.product_option_values (
  id uuid primary key default uuid_generate_v4(),
  option_id uuid references public.product_options(id) on delete cascade,
  label text not null,
  extra_price numeric not null default 0
);

create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers(id) on delete cascade,
  title text not null,
  full_address text not null,
  floor text,
  apartment text,
  doorbell text,
  phone text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  address_id uuid references public.addresses(id) on delete set null,
  status text not null default 'new' check (status in ('new','preparing','on_the_way','delivered','cancelled')),
  payment_method text not null check (payment_method in ('cash','card','online')),
  subtotal_amount numeric not null,
  delivery_fee numeric not null,
  total_amount numeric not null,
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null,
  created_at timestamptz not null default now()
);

create table public.order_item_options (
  id uuid primary key default uuid_generate_v4(),
  order_item_id uuid references public.order_items(id) on delete cascade,
  option_value_id uuid references public.product_option_values(id) on delete set null,
  label text not null,
  extra_price numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.restaurants enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.addresses enable row level security;
alter table public.order_items enable row level security;

create policy "Customers see their addresses" on public.addresses
  for select using (auth.uid() = customer_id);

create policy "Customers manage their addresses" on public.addresses
  for insert with check (auth.uid() = customer_id);

create policy "Customers view their orders" on public.orders
  for select using (auth.uid() = customer_id);

create policy "Restaurant managers view their data" on public.orders
  for select using (
    exists (
      select 1
      from public.restaurants r
      where r.id = orders.restaurant_id and r.id = current_setting('request.jwt.claims', true)::json->>'restaurant_id'
    )
  );

create policy "Restaurant managers manage menu" on public.products
  for all using (
    exists (
      select 1 from public.restaurants r
      where r.id = products.restaurant_id and r.id = current_setting('request.jwt.claims', true)::json->>'restaurant_id'
    )
  );
