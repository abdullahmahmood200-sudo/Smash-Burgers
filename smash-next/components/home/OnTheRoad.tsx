"use client";

import { useEffect, useRef } from "react";

interface Stop {
  state: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  img: string;
  reverse?: boolean;
}

const STOPS: Stop[] = [
  {
    state: "CALIFORNIA",
    city: "Los Angeles",
    address: "742 S Grand Ave, Los Angeles, CA 90017",
    phone: "(213) 555-0142",
    hours: "Open daily · 11am – 11pm",
    img: "/assets/loc-california.jpg",
  },
  {
    state: "PENNSYLVANIA",
    city: "Philadelphia",
    address: "1528 Walnut St, Philadelphia, PA 19102",
    phone: "(215) 555-0178",
    hours: "Open daily · 11am – 12am",
    img: "/assets/loc-pennsylvania.jpg",
    reverse: true,
  },
  {
    state: "TEXAS",
    city: "Austin",
    address: "219 W 4th St, Austin, TX 78701",
    phone: "(512) 555-0196",
    hours: "Open daily · 11am – 1am",
    img: "/assets/loc-texas.jpg",
  },
  {
    state: "NEW YORK",
    city: "New York City",
    address: "88 University Pl, New York, NY 10003",
    phone: "(212) 555-0110",
    hours: "Open daily · 10:30am – 2am",
    img: "/assets/loc-newyork.jpg",
    reverse: true,
  },
];

export default function OnTheRoad() {
  const routeRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const route = routeRef.current;
    const truck = truckRef.current;
    if (!route || !truck) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let smoothY: number | null = null;
    let raf = 0;

    const tick = () => {
      const stops = Array.from(route.querySelectorAll<HTMLElement>("[data-stop]"));
      if (!stops.length) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const n = stops.length;
      const vc = window.innerHeight / 2;

      const viewCenters = stops.map((s) => {
        const r = s.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const routeCenters = stops.map((s) => s.offsetTop + s.offsetHeight / 2);

      let frac: number;
      if (vc <= viewCenters[0]) frac = 0;
      else if (vc >= viewCenters[n - 1]) frac = n - 1;
      else {
        frac = 0;
        for (let i = 0; i < n - 1; i++) {
          if (vc >= viewCenters[i] && vc <= viewCenters[i + 1]) {
            frac =
              i + (vc - viewCenters[i]) / (viewCenters[i + 1] - viewCenters[i]);
            break;
          }
        }
      }
      frac = Math.max(0, Math.min(n - 1, frac));

      const i0 = Math.min(Math.floor(frac), n - 2);
      const t = frac - i0;
      const targetY = routeCenters[i0] + (routeCenters[i0 + 1] - routeCenters[i0]) * t;

      if (smoothY === null) smoothY = targetY;
      smoothY += (targetY - smoothY) * 0.12;
      truck.style.transform = `translate(-50%, ${smoothY.toFixed(1)}px) translateY(-50%)`;

      const nearest = Math.round(frac);
      stops.forEach((s, i) => {
        const m = s.querySelector<HTMLElement>("[data-marker]");
        if (!m) return;
        const on = i === nearest && Math.abs(frac - nearest) < 0.35;
        m.style.transform = `translate(-50%,-50%) scale(${on ? 1.35 : 1})`;
        m.style.background = on ? "#E8190B" : "#FFC200";
      });

      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="locations" className="relative px-8 pb-32 pt-16">
      <div className="mx-auto max-w-[900px] text-center">
        <div className="font-poster text-[clamp(18px,2vw,30px)] tracking-[2px] text-orange [text-shadow:2px_2px_0_#fff]">
          HOT &amp; DELIVERED
        </div>
        <h2 className="mb-0 mt-2.5 font-display text-[clamp(64px,11vw,190px)] leading-[0.84] tracking-tight text-red-bright [text-shadow:5px_5px_0_#fff,-3px_-3px_0_#fff,3px_-3px_0_#fff,-3px_3px_0_#fff]">
          ON THE ROAD
        </h2>
        <p className="mx-auto mt-6 max-w-[600px] text-[clamp(18px,1.6vw,28px)] font-semibold leading-snug text-ink">
          Four cities, one obsession. Scroll and ride along as the SMASH truck
          makes its delivery run.
        </p>
      </div>

      <div ref={routeRef} className="relative mx-auto mt-16 max-w-[1000px]">
        {/* rail */}
        <div className="absolute bottom-0 left-[30px] top-0 z-[1] w-3.5 -translate-x-1/2 rounded-[10px] bg-ink">
          <div
            className="absolute bottom-0 left-1/2 top-0 w-[3px] -translate-x-1/2"
            style={{
              background:
                "repeating-linear-gradient(to bottom,#FFC200 0 13px, transparent 13px 28px)",
            }}
          />
        </div>

        {/* truck */}
        <div ref={truckRef} className="absolute left-[30px] top-0 z-30 will-change-transform">
          <div className="relative h-20 w-[118px]">
            <div className="absolute bottom-[-2px] left-2.5 h-3.5 w-[98px] rounded-[50%] bg-black/20 blur-[4px]" />
            <div className="absolute left-0 top-2 h-[50px] w-[74px] rounded-[10px] bg-red shadow-[inset_0_0_0_3px_#fff]" />
            <div className="absolute left-1 top-6 w-[66px] text-center font-poster text-[15px] tracking-wide text-gold">
              SMASH
            </div>
            <div className="absolute left-[72px] top-[22px] h-9 w-[34px] rounded-[8px_13px_8px_8px] bg-orange" />
            <div className="absolute left-[78px] top-[26px] h-[15px] w-[22px] rounded-[5px] bg-cream-card" />
            <div className="absolute left-[104px] top-11 h-[7px] w-[7px] rounded-full bg-[#FFE08A]" />
            <div className="absolute left-4 top-[52px] h-[22px] w-[22px] rounded-full bg-[#23150C] shadow-[inset_0_0_0_5px_#C9CDD2]" />
            <div className="absolute left-[74px] top-[52px] h-[22px] w-[22px] rounded-full bg-[#23150C] shadow-[inset_0_0_0_5px_#C9CDD2]" />
          </div>
        </div>

        {STOPS.map((s, i) => (
          <div
            key={s.city}
            data-stop
            className="relative pl-[84px]"
            style={{ marginBottom: i === STOPS.length - 1 ? 10 : 50 }}
          >
            <div
              data-marker
              className="absolute left-[30px] top-1/2 z-[15] h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-red bg-gold transition-[transform,background] duration-200"
            />
            <div
              className={`flex flex-wrap overflow-hidden rounded-[26px] bg-cream-card shadow-[0_14px_34px_rgba(42,20,8,0.12)] ${
                s.reverse ? "flex-row-reverse" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.city}
                className="min-h-[240px] flex-[1_1_220px] self-stretch object-cover"
              />
              <div className="flex-[1_1_300px] px-8 py-8">
                <div className="font-poster text-[15px] tracking-[2px] text-orange">
                  {s.state}
                </div>
                <h3 className="mb-4 mt-1 font-display text-[clamp(30px,3vw,50px)] leading-[0.9] tracking-tight text-red-bright">
                  {s.city}
                </h3>
                <div className="mb-5 flex flex-col gap-2">
                  <div className="text-[17px] font-semibold text-ink">{s.address}</div>
                  <div className="text-[17px] font-semibold text-ink">{s.phone}</div>
                  <div className="text-[15px] font-semibold text-cocoa">{s.hours}</div>
                </div>
                <a
                  data-cursor
                  href="/menu"
                  className="inline-block rounded-full bg-red px-9 py-3.5 font-poster text-base tracking-wide text-white shadow-[0_5px_0_rgba(0,0,0,0.14)]"
                >
                  ORDER NOW
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
