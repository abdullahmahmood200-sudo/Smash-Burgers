-- SMASH Burgers — initial schema
-- Run in the Supabase SQL editor, or via `supabase db push` with the CLI.

-- ---------------------------------------------------------------------------
-- MENU
-- ---------------------------------------------------------------------------
create table if not exists public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text not null default '',
  price         numeric(10,2) not null check (price >= 0),
  badge         text,
  category      text not null default 'burger',
  image_default text,
  image_explode text,
  is_available  boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text,
  fulfillment_type text not null default 'pickup' check (fulfillment_type in ('pickup','delivery')),
  address          text,
  notes            text,
  subtotal         numeric(10,2) not null default 0,
  total            numeric(10,2) not null default 0,
  status           text not null default 'pending'
);

create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  menu_item_id  uuid references public.menu_items(id) on delete set null,
  name          text not null,
  unit_price    numeric(10,2) not null,
  quantity      int not null check (quantity > 0),
  line_total    numeric(10,2) not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.menu_items  enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Anyone may read available menu items.
drop policy if exists "menu read" on public.menu_items;
create policy "menu read"
  on public.menu_items for select
  using (is_available = true);

-- Orders / order_items are never read or written directly by the public.
-- All writes go through the place_order() RPC below (security definer), so we
-- intentionally create no public policies on these tables.

-- ---------------------------------------------------------------------------
-- ATOMIC ORDER PLACEMENT
-- ---------------------------------------------------------------------------
-- Accepts a JSON payload, recomputes prices server-side from menu_items so the
-- client can never set its own prices, inserts the order + line items in one
-- transaction, and returns the new order id.
create or replace function public.place_order(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order_id uuid;
  item         jsonb;
  mi           public.menu_items%rowtype;
  qty          int;
  running      numeric(10,2) := 0;
  line         numeric(10,2);
  ftype        text;
begin
  if jsonb_typeof(payload->'items') <> 'array'
     or jsonb_array_length(payload->'items') = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  if coalesce(trim(payload->>'customer_name'), '') = ''
     or coalesce(trim(payload->>'customer_email'), '') = '' then
    raise exception 'Name and email are required';
  end if;

  ftype := coalesce(payload->>'fulfillment_type', 'pickup');
  if ftype not in ('pickup','delivery') then
    ftype := 'pickup';
  end if;

  insert into public.orders (
    customer_name, customer_email, customer_phone,
    fulfillment_type, address, notes, subtotal, total, status
  ) values (
    trim(payload->>'customer_name'),
    trim(payload->>'customer_email'),
    nullif(trim(coalesce(payload->>'customer_phone','')), ''),
    ftype,
    nullif(trim(coalesce(payload->>'address','')), ''),
    nullif(trim(coalesce(payload->>'notes','')), ''),
    0, 0, 'pending'
  )
  returning id into new_order_id;

  for item in select * from jsonb_array_elements(payload->'items')
  loop
    qty := greatest(1, coalesce((item->>'quantity')::int, 1));

    select * into mi
    from public.menu_items
    where id = (item->>'menu_item_id')::uuid
      and is_available = true;

    if not found then
      raise exception 'Menu item % is not available', item->>'menu_item_id';
    end if;

    line := mi.price * qty;
    running := running + line;

    insert into public.order_items (
      order_id, menu_item_id, name, unit_price, quantity, line_total
    ) values (
      new_order_id, mi.id, mi.name, mi.price, qty, line
    );
  end loop;

  update public.orders
     set subtotal = running, total = running
   where id = new_order_id;

  return new_order_id;
end;
$$;

-- Let the public (anon) role call the order RPC.
grant execute on function public.place_order(jsonb) to anon, authenticated;
