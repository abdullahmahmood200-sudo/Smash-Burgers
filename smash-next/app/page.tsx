import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import Flagships from "@/components/home/Flagships";
import TheBuild from "@/components/home/TheBuild";
import Travels from "@/components/home/Travels";
import StickerPeel from "@/components/home/StickerPeel";
import OnTheRoad from "@/components/home/OnTheRoad";
import { getMenuItems, filterByCategory } from "@/lib/menu";

export const revalidate = 60;

export default async function HomePage() {
  const items = await getMenuItems();
  const flagships = filterByCategory(items, "flagship");

  return (
    <main className="relative w-full overflow-x-hidden text-red">
      <Nav variant="home" />
      <Hero />

      {/* INTRO */}
      <div className="flex flex-wrap justify-between gap-10 px-12 pb-24">
        <p className="m-0 max-w-[440px] text-[clamp(19px,1.5vw,27px)] font-semibold leading-tight text-ink">
          Smashed hot on the flat-top, our prime patties lock in ultimate
          juiciness under a caramelized crust.
        </p>
        <p className="m-0 max-w-[440px] text-right text-[clamp(19px,1.5vw,27px)] font-semibold leading-tight text-ink">
          Topped with melted cheddar and our signature chili honey glaze, crafted
          to satisfy cravings since 2008.
        </p>
      </div>

      {flagships.length > 0 && <Flagships items={flagships} />}
      <TheBuild />
      <Travels />
      <StickerPeel />
      <OnTheRoad />
      <Footer />
    </main>
  );
}
