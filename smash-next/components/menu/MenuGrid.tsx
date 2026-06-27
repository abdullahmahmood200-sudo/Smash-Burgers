"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import TapTarget from "@/components/TapTarget";
import type { MenuItem } from "@/lib/types";

export default function MenuGrid({ items }: { items: MenuItem[] }) {
  const { add } = useCart();
  const [active, setActive] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [isTouch, setIsTouch] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 3D tilt + glare, tracked per card index.
  type Tilt = { rx: number; ry: number; gx: number; gy: number; on: boolean };
  const [tilt, setTilt] = useState<Record<number, Tilt>>({});
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleTilt = (i: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || reduced.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    setTilt((prev) => ({
      ...prev,
      [i]: {
        rx: +(-ny * 12).toFixed(2),
        ry: +(nx * 12).toFixed(2),
        gx: +(((nx + 1) / 2) * 100).toFixed(1),
        gy: +(((ny + 1) / 2) * 100).toFixed(1),
        on: true,
      },
    }));
  };

  const resetTilt = (i: number) =>
    setTilt((prev) => ({
      ...prev,
      [i]: { rx: 0, ry: 0, gx: 50, gy: 50, on: false },
    }));

  useEffect(() => {
    try {
      setIsTouch(window.matchMedia("(hover: none)").matches);
    } catch {
      /* ignore */
    }
  }, []);

  // Springy pop-in on scroll into view.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setRevealed(new Set(items.map((_, i) => i)));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const idx = Number((en.target as HTMLElement).dataset.idx);
          setTimeout(
            () => setRevealed((prev) => new Set(prev).add(idx)),
            (idx % 3) * 120
          );
          io.unobserve(en.target);
        });
      },
      { threshold: 0.18 }
    );
    cardRefs.current.forEach((c) => c && io.observe(c));
    return () => io.disconnect();
  }, [items]);

  const showBackdrop = isTouch && active !== null;

  return (
    <>
      {/* touch backdrop */}
      <div
        onClick={() => setActive(null)}
        className={`fixed inset-0 z-[5] bg-ink/50 backdrop-blur-md transition-opacity duration-300 ${
          showBackdrop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <section
        className="mx-auto grid max-w-[1240px] gap-[34px] px-10 pb-24 pt-12"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        {items.map((item, i) => {
          const isActive = active === i;
          const dim = active !== null && active !== i;
          const isRevealed = revealed.has(i);
          const t = tilt[i];
          const base = !isRevealed
            ? "translateY(48px) scale(.92)"
            : isActive
            ? "scale(1.08)"
            : "scale(1)";
          const tiltStr =
            t && t.on && isRevealed
              ? `perspective(800px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) `
              : "";
          return (
            <div
              key={item.id}
              data-idx={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onMouseEnter={() => !isTouch && setActive(i)}
              onMouseMove={(e) => handleTilt(i, e)}
              onMouseLeave={() => {
                if (!isTouch) {
                  setActive(null);
                  resetTilt(i);
                }
              }}
              onClick={() => isTouch && setActive(isActive ? null : i)}
              className="relative flex cursor-pointer flex-col rounded-[30px] bg-cream-card p-6 transition-[transform,opacity,box-shadow] duration-700"
              style={{
                zIndex: isActive ? 10 : 1,
                transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
                transform: tiltStr + base,
                opacity: !isRevealed ? 0 : dim ? 0.7 : 1,
                boxShadow: isActive
                  ? "0 30px 60px rgba(42,20,8,.30)"
                  : "0 14px 30px rgba(42,20,8,.10)",
              }}
            >
              {!isTouch && (
                <div
                  className="pointer-events-none absolute inset-0 z-10 rounded-[30px]"
                  style={{
                    opacity: t?.on ? 0.15 : 0,
                    background: `radial-gradient(circle at ${t?.gx ?? 50}% ${
                      t?.gy ?? 50
                    }%, rgba(255,255,255,0.9), rgba(255,255,255,0) 55%)`,
                    transition: "opacity 0.3s ease",
                  }}
                />
              )}
              <div className="flex items-baseline justify-between gap-3.5">
                <h3 className="m-0 font-display text-[clamp(28px,2.5vw,40px)] leading-[0.92] tracking-tight text-red-bright">
                  {item.name}
                </h3>
                <span className="font-display text-[clamp(26px,2.2vw,38px)] leading-[0.9] text-red">
                  ${item.price.toFixed(0)}
                </span>
              </div>
              <p className="mb-4 mt-3 min-h-[62px] text-base font-semibold leading-snug text-ink">
                {item.description}
              </p>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#D8B68D]">
                {item.badge && (
                  <div className="absolute left-4 top-4 z-[3] -rotate-3 rounded-full bg-orange px-4 py-2 font-poster text-sm tracking-wide text-white shadow-[0_4px_0_rgba(0,0,0,0.12)]">
                    {item.badge}
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_default ?? "/assets/burger.png"}
                  alt={item.name}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[450ms]"
                  style={{ opacity: isActive && item.image_explode ? 0 : 1 }}
                />
                {item.image_explode && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_explode}
                    alt={`${item.name} exploded`}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[450ms]"
                    style={{ opacity: isActive ? 1 : 0 }}
                  />
                )}
              </div>
              <TapTarget className="mt-5 w-full">
                <button
                  data-cursor
                  onClick={(e) => {
                    e.stopPropagation();
                    add(item);
                  }}
                  className="w-full rounded-full bg-red px-5 py-4 font-poster text-[clamp(17px,1.4vw,21px)] tracking-wide text-white shadow-[0_6px_0_rgba(0,0,0,0.14)]"
                >
                  ADD TO CART
                </button>
              </TapTarget>
            </div>
          );
        })}

        {/* "coming soon" placeholders to keep the grid full and on-brand */}
        {Array.from({ length: placeholderCount(items.length) }).map((_, i) => (
          <div
            key={`ph-${i}`}
            className="relative flex flex-col rounded-[30px] bg-cream-card p-6"
          >
            <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2.5 rounded-[20px] bg-[repeating-linear-gradient(135deg,#E7DFD2,#E7DFD2_14px,#E0D7C8_14px,#E0D7C8_28px)]">
              <div className="text-center font-display text-[clamp(30px,3vw,46px)] leading-[0.9] text-[#B6A892]">
                COMING
                <br />
                SOON
              </div>
              <div className="font-body text-[15px] font-semibold tracking-wide text-[#B6A892]">
                NEW DROP LOADING
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

/** Pads the grid up to a multiple of 3 (min one row of fillers). */
function placeholderCount(n: number) {
  const target = Math.max(6, Math.ceil((n + 1) / 3) * 3);
  return target - n;
}
