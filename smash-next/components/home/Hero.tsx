"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const PHRASES = ["Searing the glazed patty…", "Preparing to serve…", "READY TO SMASH!"];

export default function Hero() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [phrase, setPhrase] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  // ---- Burger eye tracking ----
  const eyeLRef = useRef<HTMLDivElement>(null);
  const eyeRRef = useRef<HTMLDivElement>(null);
  const [pupils, setPupils] = useState({ lx: 0, ly: 0, rx: 0, ry: 0 });

  // ---- Loader build + dismissal ----
  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Only play the full loader the first time per browser session.
    const seen = sessionStorage.getItem("smash-loaded");
    if (seen || reduced.current) {
      setLoaderDone(true);
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const pieces = ["#pcBun2", "#pcPatty", "#pcCheese", "#pcBun1"];
    const tl = gsap.timeline();
    pieces.forEach((sel, i) => {
      const y = Number(
        loaderRef.current?.querySelector(sel)?.getAttribute("data-y") || 0
      );
      const rot = sel === "#pcCheese" ? -2 : 0;
      tl.to(
        sel,
        { y, rotation: rot, opacity: 1, duration: 0.6, ease: "back.out(1.8)" },
        i === 0 ? 0.15 : `+=${i === 1 ? 0.13 : 0.12}`
      );
    });

    setTextVisible(true);
    const t1 = setTimeout(() => setPhrase(1), 1500);
    const t2 = setTimeout(() => setPhrase(2), 2700);
    const t3 = setTimeout(() => finish(), 3700);

    function finish() {
      const el = loaderRef.current;
      if (el) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.7,
          onComplete: () => {
            document.documentElement.style.overflow = "";
            sessionStorage.setItem("smash-loaded", "1");
            setLoaderDone(true);
          },
        });
      } else {
        setLoaderDone(true);
      }
    }

    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  // ---- Hero entrance, after loader ----
  useEffect(() => {
    if (!loaderDone || !heroRef.current) return;
    const ctx = gsap.context(() => {
      if (reduced.current) {
        gsap.set(
          ["#heroTitle", "#heroBurger", "#heroL", "#heroR"],
          { opacity: 1, scale: 1, y: 0, x: 0 }
        );
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(
        "#heroTitle",
        { scale: 0.55, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.4)" }
      )
        .fromTo(
          "#heroBurger",
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          "#heroL",
          { y: 40, opacity: 0, rotate: -13 },
          { y: 0, opacity: 1, rotate: -13, duration: 0.7, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(
          "#heroR",
          { y: 40, opacity: 0, rotate: 11 },
          { y: 0, opacity: 1, rotate: 11, duration: 0.7, ease: "power2.out" },
          "-=0.6"
        );
    }, heroRef);
    return () => ctx.revert();
  }, [loaderDone]);

  // ---- Pupils follow the cursor (throttled via RAF, max 8px radius) ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0;
    let my = 0;
    let raf = 0;
    let pending = false;

    const compute = (el: HTMLDivElement | null) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ang = Math.atan2(my - cy, mx - cx);
      const dist = Math.min(8, Math.hypot(mx - cx, my - cy));
      return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist };
    };

    const update = () => {
      pending = false;
      const l = compute(eyeLRef.current);
      const r = compute(eyeRRef.current);
      setPupils({ lx: l.x, ly: l.y, rx: r.x, ry: r.y });
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(update);
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* ---------- LOADER ---------- */}
      {!loaderDone && (
        <div
          ref={loaderRef}
          className="fixed inset-0 z-[90000] flex flex-col items-center justify-center gap-12 bg-red"
        >
          <div className="-rotate-3 font-poster text-[clamp(26px,3vw,40px)] tracking-[3px] text-yellow-bright [text-shadow:3px_3px_0_rgba(0,0,0,0.18)]">
            SMASH
          </div>
          <div className="relative h-[200px] w-[240px]">
            <div
              id="pcBun2"
              data-y={138}
              className="absolute left-1/2 top-0 h-[52px] w-[200px] -translate-x-1/2 rounded-[18px_18px_76px_76px] bg-gradient-to-b from-[#ECA24A] to-[#D9882F] opacity-0 shadow-[inset_0_-8px_0_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.2)]"
              style={{ transform: "translate(-50%,-320px)" }}
            />
            <div
              id="pcPatty"
              data-y={104}
              className="absolute left-1/2 top-0 h-10 w-[184px] -translate-x-1/2 rounded-[18px] bg-gradient-to-b from-[#6A3B20] to-[#4A2611] opacity-0 shadow-[inset_0_3px_0_rgba(255,255,255,0.08),inset_0_-4px_0_rgba(0,0,0,0.25),0_6px_12px_rgba(0,0,0,0.2)]"
              style={{ transform: "translate(-50%,-320px)" }}
            />
            <div
              id="pcCheese"
              data-y={88}
              className="absolute left-1/2 top-0 h-6 w-[194px] -translate-x-1/2 rounded-[5px] bg-[#FFC107] opacity-0 shadow-[0_5px_10px_rgba(0,0,0,0.18)]"
              style={{ transform: "translate(-50%,-320px)" }}
            />
            <div
              id="pcBun1"
              data-y={6}
              className="absolute left-1/2 top-0 h-[98px] w-[202px] -translate-x-1/2 rounded-[101px_101px_26px_26px] bg-gradient-to-b from-[#F2B45C] to-[#E59433] opacity-0 shadow-[inset_0_10px_0_rgba(255,255,255,0.18),0_8px_16px_rgba(0,0,0,0.2)]"
              style={{ transform: "translate(-50%,-340px)" }}
            />
          </div>
          <div className="flex h-9 items-center justify-center">
            <div
              className={`font-poster text-[clamp(18px,2.2vw,28px)] tracking-wide text-white transition-opacity duration-300 ${
                textVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {PHRASES[phrase]}
            </div>
          </div>
        </div>
      )}

      {/* ---------- HERO ---------- */}
      <section
        ref={heroRef}
        className="relative flex min-h-[84vh] items-center justify-center px-6 pb-10"
      >
        <h1
          id="heroTitle"
          className="m-0 whitespace-nowrap text-center font-display text-[clamp(46px,14vw,420px)] leading-[0.8] tracking-tight text-red-bright opacity-0 [text-shadow:6px_6px_0_rgba(255,255,255,0.95),-4px_-4px_0_#fff,4px_-4px_0_#fff,-4px_4px_0_#fff] sm:text-[clamp(120px,23vw,420px)]"
        >
          THE BURGER
        </h1>

        <div
          id="heroBurger"
          className="absolute left-1/2 top-[54%] z-20 w-[clamp(320px,34vw,580px)] -translate-x-1/2 -translate-y-1/2 opacity-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/burger.png"
            alt="Smash burger"
            className="block w-full [filter:drop-shadow(0_26px_30px_rgba(0,0,0,0.28))]"
          />
          <div
            ref={eyeLRef}
            className="animate-blink absolute left-[30%] top-[24%] h-[clamp(34px,3.4vw,58px)] w-[clamp(34px,3.4vw,58px)] rounded-full bg-white [clip-path:polygon(50%_50%,100%_16%,100%_0,0_0,0_100%,100%_100%,100%_84%)]"
          >
            <div
              className="absolute left-1/2 top-1/2 h-[42%] w-[42%] rounded-full bg-[#2A1408]"
              style={{
                transform: `translate(-50%, -50%) translate(${pupils.lx}px, ${pupils.ly}px)`,
              }}
            />
          </div>
          <div
            ref={eyeRRef}
            className="animate-blink absolute left-[54%] top-[24%] h-[clamp(34px,3.4vw,58px)] w-[clamp(34px,3.4vw,58px)] rounded-full bg-white [animation-delay:0.15s] [clip-path:polygon(50%_50%,100%_16%,100%_0,0_0,0_100%,100%_100%,100%_84%)]"
          >
            <div
              className="absolute left-1/2 top-1/2 h-[42%] w-[42%] rounded-full bg-[#2A1408]"
              style={{
                transform: `translate(-50%, -50%) translate(${pupils.rx}px, ${pupils.ry}px)`,
              }}
            />
          </div>
        </div>

        <div
          id="heroL"
          className="absolute left-[9%] top-[26%] z-[25] rounded-[18px] bg-orange px-5 py-3.5 text-center font-poster text-[clamp(18px,2vw,32px)] leading-[0.92] text-white opacity-0 shadow-[0_6px_0_rgba(0,0,0,0.12)]"
          style={{ transform: "rotate(-13deg)" }}
        >
          SMASHED
          <br />
          FRESH
        </div>
        <div
          id="heroR"
          className="absolute bottom-[24%] right-[9%] z-[25] rounded-[18px] bg-orange px-5 py-3.5 text-center font-poster text-[clamp(18px,2vw,32px)] leading-[0.92] text-white opacity-0 shadow-[0_6px_0_rgba(0,0,0,0.12)]"
          style={{ transform: "rotate(11deg)" }}
        >
          BOLD
          <br />
          FLAVOR
        </div>
      </section>
    </>
  );
}
