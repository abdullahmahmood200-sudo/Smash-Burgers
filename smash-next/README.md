# SMASH Burgers — Next.js

A bold, custom burger-brand site rebuilt from the original static HTML into
**Next.js (App Router) + TypeScript + Tailwind CSS + GSAP**, with **Supabase**
powering the menu and orders. No UI component libraries — every element is
hand-built to keep the brand loud.

## Stack

- **Next.js 15** (App Router, React 19) — static home + menu pages, one API route.
- **Tailwind CSS 3** — custom theme (brand colors, the Lilita One / Luckiest Guy / Fredoka type system).
- **GSAP + ScrollTrigger** — loader build, hero reveal, parallax ingredients, the delivery-plane path, and the scroll-driven location truck.
- **Supabase** — `menu_items` + `orders` + `order_items`, with an atomic `place_order()` RPC.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys (see below)
npm run dev                  # http://localhost:3000
```

The site **runs without Supabase** — the menu falls back to a built-in seed
(`lib/seed-menu.ts`) and checkout shows a friendly "not connected yet" message.
Add the keys below to go live.

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the migrations in order:
   - `supabase/migrations/0001_init.sql` — tables, RLS, and the `place_order` RPC.
   - `supabase/migrations/0002_seed_menu.sql` — seeds the six burgers.
3. Copy **Settings → API** values into `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```

4. Restart `npm run dev`. The menu now reads from Supabase and checkout writes
   real orders.

### How ordering stays safe

The client never sends prices. `POST /api/orders` calls the `place_order`
Postgres function (`security definer`), which re-reads each item's price from
`menu_items`, inserts the order + line items in a single transaction, and
returns the new order id. `orders` / `order_items` have **no** public
read/write policies — the RPC is the only door in.

## Deploy to Vercel

1. Push this folder to a Git repo.
2. Import it in Vercel. If the repo root is the parent folder, set
   **Root Directory** to `smash-next`. Framework preset auto-detects **Next.js**.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables in
   **Project → Settings → Environment Variables**.
4. Deploy. (No `vercel.json` needed — Next.js is zero-config on Vercel.)

## Project layout

```
app/
  layout.tsx          root layout: fonts, cart provider, custom cursor
  page.tsx            home (server) — fetches menu, renders sections
  menu/page.tsx       menu (server) — fetches menu, renders grid
  api/orders/route.ts checkout endpoint → place_order RPC
components/
  Nav, Footer, CustomCursor
  home/               Hero (+loader), Flagships, TheBuild, Travels, StickerPeel, OnTheRoad
  menu/MenuGrid       explode-on-hover cards
  cart/               CartProvider (context + localStorage), CartDrawer (cart + checkout)
lib/
  supabase.ts         configured client (null when env missing)
  menu.ts             menu query with seed fallback
  seed-menu.ts        offline/fallback menu
  gsap.ts, types.ts
supabase/migrations/  0001_init.sql, 0002_seed_menu.sql
public/assets/        burger art, menu/flagship/location photos
```
