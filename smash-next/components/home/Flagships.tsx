"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { registerGsap } from "@/lib/gsap";
import MagneticButton from "@/components/MagneticButton";
import TapTarget from "@/components/TapTarget";
import SwipeCarousel from "@/components/SwipeCarousel";
import type { MenuItem } from "@/lib/types";

export default function Flagships({ items }: { items: MenuItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  // Decide layout once mounted: swipe carousel on mobile, pinned scroll on desktop.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Pinned horizontal scroll — desktop only. trackRef is null on mobile, so the
  // effect early-returns there; never pins/scrub-jacks on touch.
  useEffect(() => {
    if (isMobile) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // The track uses w-max, so its own offsetWidth equals its content width.
      // Measure the overflow against the full-width section instead.
      const getDistance = () => track.scrollWidth - section.offsetWidth;

      // Pinned horizontal scroll: cards slide left as the user scrolls down.
      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Subtle card tilt that builds as the track moves through the viewport.
      gsap.to(".burger-card", {
        rotateY: 6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [items, isMobile]);

  return (
    <section
      id="flagships"
      ref={sectionRef}
      className="relative overflow-hidden pb-8 pt-4"
    >
      <div className="px-6 pb-5 md:px-12">
        <h2 className="m-0 font-display text-[clamp(40px,5.5vw,104px)] leading-[0.85] tracking-tight text-red-bright [text-shadow:4px_4px_0_#fff]">
          PICK YOUR
          <br />
          FIGHTER
        </h2>
      </div>

      {isMobile ? (
        <div className="px-6 pb-4">
          <SwipeCarousel
            cardWidth={300}
            items={items.map((item) => (
              <article
                key={item.id}
                className="flex h-full flex-col overflow-hidden rounded-[28px] bg-cream-card shadow-[0_14px_30px_rgba(42,20,8,0.12)]"
              >
                <div className="relative aspect-[5/4] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_default ?? "/assets/burger.png"}
                    alt={item.name}
                    className="block h-full w-full object-cover"
                  />
                  {item.badge && (
                    <div className="absolute left-4 top-4 -rotate-3 rounded-full bg-orange px-4 py-2 font-poster text-sm tracking-wide text-white shadow-[0_4px_0_rgba(0,0,0,0.12)]">
                      {item.badge}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="m-0 font-display text-[clamp(26px,7vw,34px)] leading-[0.9] tracking-tight text-red-bright">
                      {item.name.toUpperCase()}
                    </h3>
                    <span className="font-display text-[clamp(24px,6vw,30px)] leading-[0.9] text-red">
                      ${item.price.toFixed(0)}
                    </span>
                  </div>
                  <p className="mb-5 mt-2 line-clamp-2 text-base font-semibold leading-tight text-ink">
                    {item.description}
                  </p>
                  <TapTarget className="mt-auto">
                    <button
                      onClick={() => add(item)}
                      className="w-full rounded-full bg-red px-6 py-3.5 font-poster text-lg tracking-wide text-white shadow-[0_6px_0_rgba(0,0,0,0.14)]"
                    >
                      ORDER NOW
                    </button>
                  </TapTarget>
                </div>
              </article>
            ))}
          />
        </div>
      ) : (
        <div
          ref={trackRef}
          className="flex w-max gap-8 px-6 md:px-12"
          style={{ willChange: "transform" }}
        >
          {items.map((item) => (
            <article
              key={item.id}
              className="burger-card flex h-[min(600px,calc(100vh-240px))] w-[min(78vw,1040px)] flex-none flex-col overflow-hidden rounded-[34px] bg-cream-card shadow-[0_18px_40px_rgba(42,20,8,0.12)]"
              style={{ transformStyle: "preserve-3d", perspective: "800px" }}
            >
              <div className="relative min-h-0 flex-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_default ?? "/assets/burger.png"}
                  alt={item.name}
                  className="block h-full w-full object-cover"
                />
                {item.badge && (
                  <div className="absolute left-6 top-6 -rotate-3 rounded-full bg-orange px-5 py-2.5 font-poster text-[clamp(15px,1.4vw,22px)] tracking-wide text-white shadow-[0_5px_0_rgba(0,0,0,0.12)]">
                    {item.badge}
                  </div>
                )}
              </div>
              <div className="shrink-0 px-9 pb-7 pt-5">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="m-0 font-display text-[clamp(32px,3.6vw,68px)] leading-[0.9] tracking-tight text-red-bright">
                    {item.name.toUpperCase()}
                  </h3>
                  <span className="font-display text-[clamp(28px,2.8vw,52px)] leading-[0.9] text-red">
                    ${item.price.toFixed(0)}
                  </span>
                </div>
                <p className="mb-5 mt-3 line-clamp-2 text-[clamp(16px,1.3vw,22px)] font-semibold leading-tight text-ink">
                  {item.description}
                </p>
                <MagneticButton>
                  <TapTarget>
                    <button
                      data-cursor
                      onClick={() => add(item)}
                      className="inline-block rounded-full bg-red px-10 py-4 font-poster text-[clamp(16px,1.3vw,22px)] tracking-wide text-white shadow-[0_6px_0_rgba(0,0,0,0.14)]"
                    >
                      ORDER NOW
                    </button>
                  </TapTarget>
                </MagneticButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
