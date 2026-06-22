import type { MenuItem } from "./types";

/** Mirrors supabase/migrations/0002_seed_menu.sql. Used as the fallback when
 *  Supabase env vars are not configured, so the site renders out of the box. */
export const SEED_MENU: MenuItem[] = [
  {
    id: "seed-classic-smash",
    slug: "classic-smash",
    name: "The Classic Smash",
    description:
      "Double smashed patties, American cheese, crisp lettuce, vine tomato, pickles and our smash sauce.",
    price: 12,
    badge: "CLASSIC",
    category: "burger",
    image_default: "/assets/card1-default.jpg",
    image_explode: "/assets/card1-explode.jpg",
    is_available: true,
    sort_order: 10,
  },
  {
    id: "seed-double-stack",
    slug: "double-stack",
    name: "The Double Stack",
    description:
      "Triple-stacked beef, smoked cheddar, layers of crispy bacon and a sweet smoky glaze.",
    price: 15,
    badge: "LOADED",
    category: "burger",
    image_default: "/assets/card2-default.jpg",
    image_explode: "/assets/card2-explode.jpg",
    is_available: true,
    sort_order: 20,
  },
  {
    id: "seed-the-signature",
    slug: "the-signature",
    name: "The Signature",
    description:
      "Brioche bun, fried egg, smashed beef, molten cheddar, herb crema and wild arugula.",
    price: 17,
    badge: "CHEF'S PICK",
    category: "burger",
    image_default: "/assets/card3-default.jpg",
    image_explode: "/assets/card3-explode.jpg",
    is_available: true,
    sort_order: 30,
  },
  {
    id: "seed-triple-stack",
    slug: "triple-stack",
    name: "The Triple Stack",
    description:
      "Three smashed patties, double cheddar, signature smash sauce. Zero mercy.",
    price: 14,
    badge: "FAN FAVORITE",
    category: "flagship",
    image_default: "/assets/flagship-1.jpg",
    image_explode: null,
    is_available: true,
    sort_order: 40,
  },
  {
    id: "seed-cocoa-riot",
    slug: "cocoa-riot",
    name: "The Cocoa Riot",
    description:
      "Cocoa lattice bun, smoked beef, herb crema, molten cheddar. Yeah, we went there.",
    price: 16,
    badge: "NEW DROP",
    category: "flagship",
    image_default: "/assets/flagship-2.jpg",
    image_explode: null,
    is_available: true,
    sort_order: 50,
  },
  {
    id: "seed-rye-rebel",
    slug: "rye-rebel",
    name: "The Rye Rebel",
    description:
      "Dark rye bun, crispy bacon, pickled red onion, sharp cheddar drip. Built loud.",
    price: 13,
    badge: "LIMITED",
    category: "flagship",
    image_default: "/assets/flagship-3.jpg",
    image_explode: null,
    is_available: true,
    sort_order: 60,
  },
];
