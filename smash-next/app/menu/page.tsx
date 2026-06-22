import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MenuGrid from "@/components/menu/MenuGrid";
import { getMenuItems, filterByCategory } from "@/lib/menu";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "SMASH Burgers — The Menu",
  description:
    "Hover a burger to blow it apart. Then get it in your hands. Order online for pickup or delivery.",
};

export default async function MenuPage() {
  const items = await getMenuItems();
  const burgers = filterByCategory(items, "burger");
  const menu = burgers.length > 0 ? burgers : items;

  return (
    <main className="min-h-screen w-full text-red">
      <Nav variant="menu" />

      <div className="px-8 pb-1.5 pt-3.5 text-center">
        <h1 className="m-0 font-display text-[clamp(46px,13vw,220px)] leading-[0.82] tracking-tight text-red-bright [text-shadow:5px_5px_0_#fff,-3px_-3px_0_#fff,3px_-3px_0_#fff,-3px_3px_0_#fff]">
          THE MENU
        </h1>
        <p className="mx-auto mt-4 max-w-[600px] text-[clamp(18px,1.6vw,26px)] font-semibold leading-snug text-ink">
          Hover a burger to blow it apart. Tap on mobile to see every layer. Then
          get it in your hands.
        </p>
      </div>

      <MenuGrid items={menu} />
      <Footer big={false} />
    </main>
  );
}
