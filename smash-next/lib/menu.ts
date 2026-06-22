import { getSupabase } from "./supabase";
import { SEED_MENU } from "./seed-menu";
import type { MenuItem } from "./types";

/** Fetches all available menu items. Falls back to the static seed menu when
 *  Supabase is not configured or the query fails, so the page never breaks. */
export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = getSupabase();
  if (!supabase) return SEED_MENU;

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error("[menu] Supabase fetch failed:", error.message);
    return SEED_MENU;
  }

  return data as MenuItem[];
}

export function filterByCategory(items: MenuItem[], category: string) {
  return items.filter((i) => i.category === category);
}
