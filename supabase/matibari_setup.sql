-- ============================================================================
--  MATIBARI — COMPLETE DATABASE SETUP (Supabase / PostgreSQL)   [v2 — fixed]
-- ============================================================================
--  HOW TO USE THIS FILE
--  1. Open Supabase Dashboard -> your project -> SQL Editor
--  2. DELETE everything already typed in the editor (file names are NOT valid SQL)
--  3. Copy EVERYTHING in this file and paste it into the editor
--  4. Click "Run"  (Ctrl + Enter)
--
--  Expected result: "Success. No rows returned"
--
--  NOTE: This version uses ONLY built-in PostgreSQL functions.
--  No pgcrypto / no crypt() / no extensions needed  ->  works on every Supabase project.
-- ============================================================================


-- ============================================================================
--  STEP 0 — CLEAN START  (fixes "column id referenced in foreign key" error)
--  Purani / galat format wali tables hata kar fresh banata hai.
--  Is script me saara data dobara seed hota hai -> kuch important loss nahi.
-- ============================================================================
drop table if exists public.otp_challenges cascade;
drop table if exists public.orders         cascade;
drop table if exists public.products       cascade;
drop table if exists public.site_settings  cascade;
drop table if exists public.admin_users    cascade;

drop function if exists public.verify_admin(text, text);
drop function if exists public.set_admin_password(text, text);
drop function if exists public.hash_password(text, text);
drop function if exists public.hash_password(text);
drop function if exists public.new_salt();
drop function if exists public.set_updated_at();


-- ============================================================================
--  STEP 1 — PASSWORD HELPERS  (salted SHA-256, built-in only)
--  Stored format:  salt$hash      e.g.  a1b2c3$9f8e7d...
--  (In production you will hash in your server with bcrypt/argon2 instead.)
-- ============================================================================
create or replace function public.hash_password(p_password text, p_salt text)
returns text
language sql
immutable
as $$
  select encode(sha256(convert_to(p_salt || p_password, 'UTF8')), 'hex');
$$;

create or replace function public.new_salt()
returns text
language sql
volatile
as $$
  select md5(random()::text || clock_timestamp()::text || random()::text);
$$;


-- ============================================================================
--  STEP 2 — PRODUCTS TABLE  (the shop catalogue)
-- ============================================================================
create table if not exists public.products (
  id          text primary key,
  name        text        not null,
  category    text        not null default 'General',
  price       numeric     not null default 0,
  mrp         numeric     not null default 0,
  unit        text        not null default '',
  rating      numeric     not null default 5,
  reviews     integer     not null default 0,
  image       text        not null default '',
  tag         text,
  description text        not null default '',
  active      boolean     not null default true,
  stock       integer     not null default 0,
  sold        integer     not null default 0,
  is_combo    boolean     not null default false,
  combo_items jsonb,
  featured    boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ============================================================================
--  STEP 3 — SITE SETTINGS  (brand name, logo, tagline, hero, contact)
-- ============================================================================
create table if not exists public.site_settings (
  id          integer primary key default 1,
  brand_name  text not null default 'Matibari',
  tagline     text not null default 'Handcrafted | Natural | Traditional',
  logo        text not null default '/images/logo.png',
  email       text not null default 'hello@matibari.in',
  phone       text not null default '+91 98765 43210',
  whatsapp    text not null default '919876543210',
  address     text not null default '14/2, Krishi Bhavan Road, Indore, Madhya Pradesh 452001, India',
  hero_kicker text not null default '100% Certified Organic · Made in India',
  hero_title1 text not null default 'From Our Soil to',
  hero_title2 text not null default 'Your Soul.',
  hero_text   text not null default 'Matibari brings you pesticide-free spices, grains, honey and ghee sourced directly from small farmers across India.',
  updated_at  timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);


-- ============================================================================
--  STEP 4 — ADMIN USERS  (who can sign in to the dashboard)
-- ============================================================================
create table if not exists public.admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text        not null,
  full_name     text        not null default 'Store Admin',
  phone         text,
  role          text        not null default 'admin',
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now()
);


-- ============================================================================
--  STEP 5 — OTP CHALLENGES  (one-time login codes)
-- ============================================================================
create table if not exists public.otp_challenges (
  id         uuid primary key default gen_random_uuid(),
  admin_id   uuid        not null references public.admin_users(id) on delete cascade,
  code_hash  text        not null,
  attempts   integer     not null default 0,
  expires_at timestamptz not null,
  used       boolean     not null default false,
  created_at timestamptz not null default now()
);


-- ============================================================================
--  STEP 6 — ORDERS  (for the sales dashboard)
-- ============================================================================
create table if not exists public.orders (
  id             text primary key,
  customer       text        not null,
  email          text        not null,
  item_count     integer     not null default 1,
  product_name   text        not null,
  product_image  text        not null default '',
  total          numeric     not null default 0,
  payment        text        not null default 'Paid',
  payment_method text        not null default 'UPI',
  status         text        not null default 'Processing',
  created_at     timestamptz not null default now()
);


-- ============================================================================
--  STEP 7 — AUTO update updated_at ON EVERY EDIT
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();


-- ============================================================================
--  STEP 8 — SECURITY (Row Level Security)
--  Anyone can READ products + settings (that is your public website).
--  Writing happens only with the service_role key (your server / admin API).
--  admin_users, otp_challenges and orders have NO public access at all.
-- ============================================================================
alter table public.products       enable row level security;
alter table public.site_settings  enable row level security;
alter table public.admin_users    enable row level security;
alter table public.otp_challenges enable row level security;
alter table public.orders         enable row level security;

drop policy if exists "public_read_products" on public.products;
create policy "public_read_products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_settings" on public.site_settings;
create policy "public_read_settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);


-- ============================================================================
--  STEP 9 — DEFAULT BRAND SETTINGS
-- ============================================================================
insert into public.site_settings (id, brand_name, tagline, logo, email, phone, whatsapp, address,
                                  hero_kicker, hero_title1, hero_title2, hero_text)
values (1,
        'Matibari',
        'Handcrafted | Natural | Traditional',
        '/images/logo.png',
        'hello@matibari.in',
        '+91 98765 43210',
        '919876543210',
        '14/2, Krishi Bhavan Road, Indore, Madhya Pradesh 452001, India',
        '100% Certified Organic · Made in India',
        'From Our Soil to',
        'Your Soul.',
        'Matibari brings you pesticide-free spices, grains, honey and ghee sourced directly from small farmers across India — grown the way nature intended, for three generations and counting.')
on conflict (id) do nothing;


-- ============================================================================
--  STEP 10 — DEMO PRODUCTS  (3 live + 4 hidden, ready to switch on later)
-- ============================================================================
insert into public.products
  (id, name, category, price, mrp, unit, rating, reviews, image, tag, description, active, stock, sold)
values
  ('ghee',     'A2 Bilona Desi Ghee',        'Dairy',      799, 899, '500ml', 4.9, 521, '/images/product-ghee.jpg',     'Bestseller',     'Slow-cooked from cultured A2 milk using the traditional bilona method.', true,  41, 176),
  ('honey',    'Raw Forest Honey',           'Sweeteners', 349, 420, '500g',  4.9, 456, '/images/product-honey.jpg',    'Farmer''s Pick', 'Unheated, unfiltered honey collected from wild forest hives.',           true,  62, 198),
  ('pickle',   'Aam ka Achaar',              'Pickles',    249, 299, '400g',  4.8, 187, '/images/product-pickle.jpg',   'New',            'Sun-matured raw mango pickle with cold-pressed mustard oil.',            true,  28,  96),
  ('turmeric', 'Lakadong Turmeric Powder',   'Spices',     249, 299, '200g',  4.8, 312, '/images/product-turmeric.jpg', 'Bestseller',     'High-curcumin turmeric, stone-ground in small batches.',                false, 84, 326),
  ('rice',     'Aged Organic Basmati Rice',  'Grains',     399, 450, '1kg',   4.7, 208, '/images/product-rice.jpg',     null,             'Naturally aged aromatic basmati from organic paddies.',                 false, 52, 214),
  ('spices',   'Everyday Masala Spice Box',  'Spices',     599, 699, 'Set of 7', 4.6, 174, '/images/product-spices.jpg',  null,             'Seven everyday organic spices in one handcrafted box.',                 false,  9, 143),
  ('oil',      'Cold-Pressed Coconut Oil',  'Oils',       299, 349, '1L',    4.7, 265, '/images/product-oil.jpg',      null,           'Wood-pressed virgin coconut oil with no additives.',                   false, 63, 126)
on conflict (id) do nothing;


-- ===== STEP 10b : NEW PRODUCTS (Bori, Tok-Jhal Achar) + SPECIAL COMBOS =====
insert into public.products
  (id, name, category, price, mrp, unit, rating, reviews, image, tag, description, active, stock, sold, is_combo, combo_items, featured)
values
  ('bori-pack-4',       'Bori - Pack of 4',       'Bori',          250, 320, 'Pack of 4',    4.8,  96, '',                         'Traditional',  'Sun-dried lentil bori, hand-made the traditional way.', true, 40, 62, false, null, false),
  ('bori-pack-3',       'Bori - Pack of 3',       'Bori',          250, 260, 'Pack of 3',    4.8,  74, '',                         null,           'Sun-dried lentil bori, hand-made the traditional way.', true, 45, 51, false, null, false),
  ('bori-pack-2',       'Bori - Pack of 2',       'Bori',          250, 255, 'Pack of 2',    4.7,  58, '',                         null,           'Sun-dried lentil bori, hand-made the traditional way.', true, 55, 44, false, null, false),
  ('achar-tok-jhal-250','Tok-Jhal Achar Combo',   'Pickles',       250, 299, '250g combo',   4.9, 132, '/images/product-pickle.jpg','Tok + Jhal',   'Tangy Tok and spicy Jhal mango pickles packed together.', true, 36, 88, false, null, false),
  ('achar-tok-jhal-500','Tok-Jhal Achar Combo',   'Pickles',       500, 579, '500g combo',   4.9, 132, '/images/product-pickle.jpg','Family Pack',  'The bigger Tok + Jhal mango pickle duo for the family.',  true, 22, 57, false, null, false),
  ('combo-achar-bori',  'Achar + Bori Combo',     'Special Combos',449, 500, '2 products',   4.9,  64, '/images/product-pickle.jpg','Special Combo','Tok-Jhal Achar paired with traditional sun-dried Bori.',   true, 30, 41, true,
     '[{"name":"Tok-Jhal Achar","qty":1,"image":"/images/product-pickle.jpg"},{"name":"Bori","qty":1,"image":""}]'::jsonb, false),
  ('combo-trio',        'Honey + Bori + Achar Combo','Special Combos',799, 999, '3 products', 5.0, 118, '/images/product-honey.jpg','Best Value',  'Raw Forest Honey, traditional Bori and tangy Tok-Jhal Achar bundled together.', true, 25, 73, true,
     '[{"name":"Raw Forest Honey","qty":1,"image":"/images/product-honey.jpg"},{"name":"Bori","qty":1,"image":""},{"name":"Tok-Jhal Achar","qty":1,"image":"/images/product-pickle.jpg"}]'::jsonb, true)
on conflict (id) do nothing;


-- ============================================================================
--  STEP 11 — DEMO ORDERS (dashboard ke liye)
-- ============================================================================
insert into public.orders
  (id, customer, email, item_count, product_name, product_image, total, payment, payment_method, status)
values
  ('MB-10482', 'Aarav Sharma',   'aarav.s@example.com',  3, 'A2 Bilona Desi Ghee', '/images/product-ghee.jpg',  2397, 'Paid',     'UPI',        'Processing'),
  ('MB-10481', 'Meera Iyer',     'meera.i@example.com',  2, 'Raw Forest Honey',    '/images/product-honey.jpg',  698, 'Paid',     'Card',       'Packed'),
  ('MB-10480', 'Kabir Malhotra', 'kabir.m@example.com',  4, 'Aam ka Achaar',       '/images/product-pickle.jpg',  996, 'Paid',     'UPI',        'Shipped'),
  ('MB-10479', 'Ananya Rao',     'ananya.r@example.com', 1, 'A2 Bilona Desi Ghee', '/images/product-ghee.jpg',   799, 'Paid',     'Netbanking', 'Delivered'),
  ('MB-10478', 'Devika Nair',    'devika.n@example.com', 3, 'Raw Forest Honey',    '/images/product-honey.jpg', 1047, 'Paid',     'Card',       'Delivered'),
  ('MB-10477', 'Ishaan Desai',   'ishaan.d@example.com', 2, 'Aam ka Achaar',       '/images/product-pickle.jpg',  498, 'Refunded', 'UPI',        'Delivered')
on conflict (id) do nothing;


-- ============================================================================
--  STEP 12 — ADMIN LOGIN
--  Email:    saptarsree.b@skykingindia.com
--  Password: @Saptarsee1998
-- ============================================================================
insert into public.admin_users (email, password_hash, full_name)
values ('saptarsree.b@skykingindia.com', public.hash_password('@Saptarsee1998', public.new_salt()), 'Saptarsee')
on conflict (email) do update
  set password_hash = excluded.password_hash,
      full_name     = excluded.full_name,
      is_active     = true;


-- ============================================================================
--  STEP 13 — HELPER FUNCTIONS
-- ============================================================================

-- check admin login  ->  returns true / false
create or replace function public.verify_admin(p_email text, p_password text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(p_email)
      and is_active = true
      and split_part(password_hash, '$', 2)
          = public.hash_password(p_password, split_part(password_hash, '$', 1))
  );
$$;

-- change password  ->  select public.set_admin_password('saptarsree.b@skykingindia.com', 'NayaPassword@123');
create or replace function public.set_admin_password(p_email text, p_password text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.admin_users
  set password_hash = public.hash_password(p_password, public.new_salt())
  where lower(email) = lower(p_email);
end;
$$;


-- ============================================================================
--  DONE!  TEST IT — run these one by one:
--
--  1) select public.verify_admin('saptarsree.b@skykingindia.com', '@Saptarsee1998');
--     -> must return  true
--
--  2) select public.verify_admin('saptarsree.b@skykingindia.com', 'galat-password');
--     -> must return  false
--
--  3) select id, name, price, active from public.products;
--     -> 7 rows (ghee, honey, pickle = true)
--
--  4) select brand_name, tagline from public.site_settings;
-- ============================================================================
