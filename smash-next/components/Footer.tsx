"use client";

import { useEffect, useRef } from "react";

const LINKS_LEFT = [
  "About Us",
  "Our Food",
  "Catering",
  "News",
  "Delivery",
  "Rewards",
  "Gift Cards",
  "Locations",
];
const LINKS_RIGHT = [
  "Careers",
  "Deals",
  "Franchising",
  "FAQ",
  "Certified Angus Beef",
  "Supply Chain",
  "Contact",
  "$4.99 All-the-time Menu",
];

/** Ingredient charms that hang from the footer rail and sway with scroll
 *  velocity + a gentle idle motion — a lightweight spring simulation. */
export default function Footer({ big = true }: { big?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pivots = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-pivot]")
    );
    if (!pivots.length) return;

    const st = pivots.map(() => ({ a: 0, v: 0 }));
    let lastY = window.scrollY;
    let raf = 0;

    const loop = () => {
      const y = window.scrollY;
      const dv = y - lastY;
      lastY = y;
      const t = Date.now();
      pivots.forEach((p, i) => {
        const s = st[i];
        s.v += dv * 0.05 * (i % 2 ? 1 : -1) * (1 - i * 0.06);
        s.v += Math.sin(t / 760 + i * 1.3) * 0.018; // idle sway
        s.v += -s.a * 0.014; // spring back
        s.v *= 0.965; // damping
        s.a += s.v;
        if (s.a > 32) {
          s.a = 32;
          s.v *= -0.4;
        }
        if (s.a < -32) {
          s.a = -32;
          s.v *= -0.4;
        }
        p.style.transform = `rotate(${s.a.toFixed(2)}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-red px-6 pt-8 text-cream md:px-10">
      {/* hanging charms */}
      <div ref={wrapRef} className="relative mx-auto h-[230px] max-w-[1200px]">
        <div className="absolute left-0 right-0 top-0 h-[5px] rounded bg-white/25" />
        {CHARMS.map((c, i) => (
          <div key={i} className="absolute top-0" style={{ left: c.left }}>
            <div data-pivot className="origin-top">
              <div
                className="mx-auto w-[2px] bg-white/50"
                style={{ height: c.cord }}
              />
              {c.node}
            </div>
          </div>
        ))}
      </div>

      {/* columns */}
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-x-16 gap-y-12 pt-5">
        <FooterCol title="HELPFUL LINKS" links={LINKS_LEFT} />
        <FooterCol title="INQUIRIES" links={LINKS_RIGHT} />
        <div className="min-w-[240px]">
          <h4 className="mb-5 font-poster text-[22px] tracking-wide text-yellow-bright">
            DOWNLOAD OUR APP
          </h4>
          <div className="flex max-w-[240px] flex-col gap-3.5">
            <AppBadge top="GET IT ON" bottom="Google Play" />
            <AppBadge top="Download on the" bottom="App Store" />
          </div>
        </div>
      </div>

      {big && (
        <div className="mt-10 text-center leading-[0.78]">
          <div className="font-poster text-[clamp(56px,24vw,400px)] tracking-tight text-cream [text-shadow:5px_6px_0_rgba(0,0,0,0.14)]">
            SMASH
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-cream/25 py-6">
        <div className="font-poster text-[15px] tracking-wide text-cream">
          © 2026 SMASH BURGERS
        </div>
        <p className="m-0 max-w-[760px] text-xs font-normal leading-relaxed text-cream/70">
          Apple and the Apple logo are trademarks of Apple Inc. App Store is a
          service mark of Apple Inc. Google Play and the Google Play logo are
          trademarks of Google Inc.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="min-w-[170px]">
      <h4 className="mb-5 font-poster text-[22px] tracking-wide text-yellow-bright">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l}>
            <a
              data-cursor
              href="#"
              className="text-[17px] font-semibold text-cream transition-colors hover:text-yellow-bright"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppBadge({ top, bottom }: { top: string; bottom: string }) {
  return (
    <a
      data-cursor
      href="#"
      className="flex items-center gap-3.5 rounded-2xl bg-[#1A1410] px-5 py-3 text-white"
    >
      <span className="h-6 w-6 flex-none rounded-md bg-white" />
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] tracking-wide opacity-80">{top}</span>
        <span className="text-xl font-bold">{bottom}</span>
      </span>
    </a>
  );
}

const CHARMS = [
  {
    left: "10%",
    cord: "96px",
    node: (
      <div className="h-[70px] w-[70px] rounded-full bg-[#E23B2E] shadow-[inset_0_0_0_8px_#C32A1E,inset_0_0_0_12px_#F1655A]" />
    ),
  },
  {
    left: "28%",
    cord: "140px",
    node: (
      <div className="h-16 w-16 rotate-[14deg] rounded-[13px] bg-gold shadow-[inset_0_0_0_6px_#E0A700]" />
    ),
  },
  {
    left: "46%",
    cord: "80px",
    node: (
      <div className="h-[58px] w-[92px] rounded-[60%_60%_70%_70%/80%_80%_50%_50%] bg-[#4FAE2E] shadow-[inset_0_-8px_0_rgba(0,0,0,0.1)]" />
    ),
  },
  {
    left: "64%",
    cord: "120px",
    node: (
      <div className="h-8 w-[84px] rounded-2xl bg-gradient-to-b from-[#6A3B20] to-[#4A2611] shadow-[inset_0_-4px_0_rgba(0,0,0,0.25)]" />
    ),
  },
  {
    left: "84%",
    cord: "104px",
    node: (
      <div className="h-[66px] w-[66px] rounded-full border-[11px] border-[#D98BB4] bg-transparent shadow-[inset_0_0_0_4px_#B86A95]" />
    ),
  },
];
