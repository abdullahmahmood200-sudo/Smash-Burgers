"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { registerGsap } from "@/lib/gsap";
import type { MenuItem } from "@/lib/types";

export default function Flagships({ items }: { items: MenuItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  useEffect(() => {
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
  }, [items]);

  return (
    <section
      id="flagships"
      ref={sectionRef}
      className="relative overflow-hidden pb-24 pt-4"
    >
      <div className="px-6 pb-8 md:px-12">
        <h2 className="m-0 font-display text-[clamp(54px,7vw,128px)] leading-[0.85] tracking-tight text-red-bright [text-shadow:4px_4px_0_#fff]">
          PICK YOUR
          <br />
          FIGHTER
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex w-max gap-8 px-6 pb-8 pt-2.5 md:px-12"
        style={{ willChange: "transform" }}
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="burger-card w-[min(78vw,1040px)] flex-none overflow-hidden rounded-[34px] bg-cream-card shadow-[0_18px_40px_rgba(42,20,8,0.12)]"
            style={{ transformStyle: "preserve-3d", perspective: "800px" }}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_default ?? "/assets/burger.png"}
                alt={item.name}
                className="block h-[clamp(280px,42vh,520px)] w-full object-cover"
              />
              {item.badge && (
                <div className="absolute left-6 top-6 -rotate-3 rounded-full bg-orange px-5 py-2.5 font-poster text-[clamp(15px,1.4vw,22px)] tracking-wide text-white shadow-[0_5px_0_rgba(0,0,0,0.12)]">
                  {item.badge}
                </div>
              )}
            </div>
            <div className="px-10 pb-10 pt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-5">
                <h3 className="m-0 font-display text-[clamp(40px,4.4vw,84px)] leading-[0.9] tracking-tight text-red-bright">
                  {item.name.toUpperCase()}
                </h3>
                <span className="font-display text-[clamp(34px,3.4vw,62px)] leading-[0.9] text-red">
                  ${item.price.toFixed(0)}
                </span>
              </div>
              <p className="mb-7 mt-4 text-[clamp(19px,1.5vw,26px)] font-semibold leading-tight text-ink">
                {item.description}
              </p>
              <button
                data-cursor
                onClick={() => add(item)}
                className="inline-block rounded-full bg-red px-12 py-5 font-poster text-[clamp(18px,1.5vw,24px)] tracking-wide text-white shadow-[0_6px_0_rgba(0,0,0,0.14)] transition-transform active:translate-y-1"
              >
                ORDER NOW
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
