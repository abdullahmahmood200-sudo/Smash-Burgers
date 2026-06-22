-- SMASH Burgers — seed the menu.
-- Safe to re-run: upserts by slug.

insert into public.menu_items
  (slug, name, description, price, badge, category, image_default, image_explode, is_available, sort_order)
values
  ('classic-smash', 'The Classic Smash',
   'Double smashed patties, American cheese, crisp lettuce, vine tomato, pickles and our smash sauce.',
   12.00, 'CLASSIC', 'burger', '/assets/card1-default.jpg', '/assets/card1-explode.jpg', true, 10),

  ('double-stack', 'The Double Stack',
   'Triple-stacked beef, smoked cheddar, layers of crispy bacon and a sweet smoky glaze.',
   15.00, 'LOADED', 'burger', '/assets/card2-default.jpg', '/assets/card2-explode.jpg', true, 20),

  ('the-signature', 'The Signature',
   'Brioche bun, fried egg, smashed beef, molten cheddar, herb crema and wild arugula.',
   17.00, 'CHEF''S PICK', 'burger', '/assets/card3-default.jpg', '/assets/card3-explode.jpg', true, 30),

  ('triple-stack', 'The Triple Stack',
   'Three smashed patties, double cheddar, signature smash sauce. Zero mercy.',
   14.00, 'FAN FAVORITE', 'flagship', '/assets/flagship-1.jpg', null, true, 40),

  ('cocoa-riot', 'The Cocoa Riot',
   'Cocoa lattice bun, smoked beef, herb crema, molten cheddar. Yeah, we went there.',
   16.00, 'NEW DROP', 'flagship', '/assets/flagship-2.jpg', null, true, 50),

  ('rye-rebel', 'The Rye Rebel',
   'Dark rye bun, crispy bacon, pickled red onion, sharp cheddar drip. Built loud.',
   13.00, 'LIMITED', 'flagship', '/assets/flagship-3.jpg', null, true, 60)
on conflict (slug) do update set
  name          = excluded.name,
  description   = excluded.description,
  price         = excluded.price,
  badge         = excluded.badge,
  category      = excluded.category,
  image_default = excluded.image_default,
  image_explode = excluded.image_explode,
  is_available  = excluded.is_available,
  sort_order    = excluded.sort_order;
