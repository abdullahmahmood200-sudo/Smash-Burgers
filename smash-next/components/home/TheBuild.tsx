"use client";

import { useEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap";

interface Floater {
  dir: "l" | "r";
  speed: number;
  pos: React.CSSProperties;
  node: React.ReactNode;
}

const FLOATERS: Floater[] = [
  { dir: "l", speed: 1.4, pos: { left: "4%", top: "10%" }, node: <Tomato /> },
  { dir: "l", speed: 2.1, pos: { left: "8%", top: "44%" }, node: <Cheese r={14} /> },
  { dir: "l", speed: 1.1, pos: { left: "3%", bottom: "14%" }, node: <Lettuce /> },
  { dir: "l", speed: 2.6, pos: { left: "14%", top: "74%" }, node: <Patty /> },
  { dir: "r", speed: 1.7, pos: { right: "5%", top: "8%" }, node: <Onion /> },
  { dir: "r", speed: 1.2, pos: { right: "9%", top: "42%" }, node: <Tomato /> },
  { dir: "r", speed: 2.3, pos: { right: "4%", bottom: "18%" }, node: <Cheese r={-16} /> },
  { dir: "r", speed: 1.5, pos: { right: "13%", top: "72%" }, node: <Lettuce small /> },
];

export default function TheBuild() {
  const wrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      wrap.querySelectorAll<HTMLElement>("[data-float]").forEach((el) => {
        const dir = el.dataset.dir === "l" ? -1 : 1;
        const speed = parseFloat(el.dataset.speed || "1");
        gsap.fromTo(
          el,
          { x: dir * (220 + speed * 60), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top 88%",
              end: "top 38%",
              scrub: true,
            },
          }
        );
        gsap.fromTo(
          el,
          { y: 90 * speed },
          {
            y: -90 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, wrap);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="the-build"
      ref={wrapRef}
      className="relative overflow-hidden px-6 pb-36 pt-16"
    >
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          data-float
          data-dir={f.dir}
          data-speed={f.speed}
          className="absolute z-[2]"
          style={f.pos}
        >
          {f.node}
        </div>
      ))}

      <div className="relative z-[5] mx-auto max-w-[980px] text-center">
        <h2 className="m-0 font-display text-[clamp(64px,12vw,210px)] leading-[0.84] tracking-tight text-red-bright [text-shadow:5px_5px_0_#fff,-3px_-3px_0_#fff,3px_-3px_0_#fff,-3px_3px_0_#fff]">
          THE BUILD
        </h2>
        <p className="mx-auto mt-8 max-w-[640px] text-[clamp(20px,1.7vw,30px)] font-semibold leading-snug text-ink">
          No shortcuts. No freezer. Just a screaming-hot flat-top, fresh beef,
          and a bun that can take the heat — stacked layer by layer.
        </p>
        <a
          data-cursor
          href="#travels"
          className="mt-11 inline-block rounded-full bg-red px-[70px] py-6 font-poster text-[clamp(20px,1.8vw,30px)] tracking-wide text-white shadow-[0_8px_0_rgba(0,0,0,0.14)]"
        >
          BUILD YOURS
        </a>
      </div>
    </section>
  );
}

function Tomato() {
  return (
    <div className="h-[74px] w-[74px] rounded-full bg-[#E23B2E] shadow-[inset_0_0_0_8px_#C32A1E,inset_0_0_0_12px_#F1655A]" />
  );
}
function Cheese({ r }: { r: number }) {
  return (
    <div
      className="animate-bobLite h-16 w-16 rounded-[13px] bg-gold shadow-[inset_0_0_0_6px_#E0A700]"
      style={{ transform: `rotate(${r}deg)`, "--r": `${r}deg` } as React.CSSProperties}
    />
  );
}
function Lettuce({ small }: { small?: boolean }) {
  return (
    <div
      className="rounded-[60%_60%_70%_70%/80%_80%_50%_50%] bg-[#4FAE2E] shadow-[inset_0_-8px_0_rgba(0,0,0,0.08)]"
      style={{ width: small ? 84 : 96, height: small ? 52 : 60 }}
    />
  );
}
function Patty() {
  return (
    <div className="h-[30px] w-[78px] rounded-2xl bg-gradient-to-b from-[#6A3B20] to-[#4A2611] shadow-[inset_0_-4px_0_rgba(0,0,0,0.25)]" />
  );
}
function Onion() {
  return (
    <div className="animate-bobLite h-[70px] w-[70px] rounded-full border-[11px] border-[#D98BB4] bg-transparent shadow-[inset_0_0_0_4px_#B86A95]" />
  );
}
