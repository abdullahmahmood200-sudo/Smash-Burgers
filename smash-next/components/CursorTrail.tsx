"use client";

import { useEffect, useRef } from "react";

/** Per-item lerp delays — item 0 trails the least, item 5 the most. */
const LERPS = [0.18, 0.14, 0.1, 0.08, 0.06, 0.04];

function Tomato() {
  return (
    <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden="true">
      <path
        d="M256 150c124 0 214 80 214 180 0 100-90 150-214 150S42 430 42 330c0-100 90-180 214-180z"
        fill="#E32A26"
        stroke="#1a1a1a"
        strokeWidth="22"
      />
      <path
        d="M256 172 196 116l44 22 16-58 16 58 44-22-60 56z"
        fill="#4E9A2F"
        stroke="#1a1a1a"
        strokeWidth="20"
        strokeLinejoin="round"
      />
      <rect x="242" y="92" width="28" height="70" rx="12" fill="#3C7A24" />
      <ellipse cx="150" cy="275" rx="36" ry="50" fill="#F5605C" opacity="0.85" />
    </svg>
  );
}

function Cheese() {
  return (
    <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden="true">
      <path
        d="M40 250 290 60c130 30 190 140 190 200v160c0 30-25 50-55 50H80c-25 0-45-20-45-50V280c0-15 3-25 5-30z"
        fill="#F4DC6E"
        stroke="#2b2b2b"
        strokeWidth="22"
        strokeLinejoin="round"
      />
      <path
        d="M35 252h445v168c0 30-25 50-55 50H80c-25 0-45-20-45-50z"
        fill="#F0C44F"
      />
      <line x1="35" y1="252" x2="480" y2="252" stroke="#2b2b2b" strokeWidth="18" />
      <circle cx="362" cy="150" r="30" fill="#F0C44F" stroke="#2b2b2b" strokeWidth="18" />
      <circle cx="150" cy="178" r="28" fill="none" stroke="#2b2b2b" strokeWidth="18" />
      <path d="M196 322q20-24 40 0" fill="none" stroke="#2b2b2b" strokeWidth="18" strokeLinecap="round" />
      <path d="M290 322q20-24 40 0" fill="none" stroke="#2b2b2b" strokeWidth="18" strokeLinecap="round" />
      <path d="M236 352q26 28 52 0" fill="none" stroke="#2b2b2b" strokeWidth="18" strokeLinecap="round" />
      <circle cx="180" cy="358" r="22" fill="#F0A0B4" />
      <circle cx="344" cy="358" r="22" fill="#F0A0B4" />
    </svg>
  );
}

function Carrot() {
  return (
    <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden="true">
      <path d="M322 150c12-58 60-100 100-100-8 60-38 120-90 142z" fill="#3FB23E" />
      <path d="M330 180c30-70 100-110 142-90-20 50-70 100-130 110z" fill="#5FC44D" />
      <path d="M360 212c60-62 110-62 142-44-32 50-92 80-152 70z" fill="#00A859" />
      <path
        d="M362 200c40 40 28 102-62 162-100 70-178 110-228 110-10-50 40-150 110-240 72-80 142-72 180-32z"
        fill="#F5453F"
      />
      <g stroke="#C42A36" strokeWidth="18" strokeLinecap="round">
        <line x1="252" y1="202" x2="302" y2="252" />
        <line x1="190" y1="272" x2="245" y2="317" />
        <line x1="128" y1="352" x2="183" y2="392" />
      </g>
    </svg>
  );
}

function Onion() {
  return (
    <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden="true">
      <path
        d="M60 250c0-100 120-160 230-140 130 25 180 120 170 210s-100 140-210 140S60 380 60 250z"
        fill="#9B1B5A"
      />
      <ellipse cx="220" cy="230" rx="180" ry="120" fill="#F0A8CC" transform="rotate(-18 220 230)" />
      <g fill="none" stroke="#D87BA8" strokeWidth="13">
        <ellipse cx="220" cy="230" rx="135" ry="88" transform="rotate(-18 220 230)" />
        <ellipse cx="220" cy="230" rx="92" ry="58" transform="rotate(-18 220 230)" />
        <ellipse cx="220" cy="230" rx="50" ry="30" transform="rotate(-18 220 230)" />
      </g>
    </svg>
  );
}

const ICONS = [Tomato, Cheese, Carrot, Onion, Tomato, Cheese];

export default function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Mobile / reduced-motion: kill the trail and restore the default cursor.
    if (window.innerWidth < 768 || reduced) {
      document.documentElement.classList.add("cursor-trail-off");
      return;
    }

    const dot = dotRef.current;
    const container = containerRef.current;
    if (!dot || !container) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    const pos = LERPS.map(() => ({ x: mx, y: my }));
    let shown = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        container.style.opacity = "1";
      }
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      dx += (mx - dx) * 0.15;
      dy += (my - dy) * 0.15;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;

      pos.forEach((p, i) => {
        p.x += (mx - p.x) * LERPS[i];
        p.y += (my - p.y) * LERPS[i];
        const el = itemRefs.current[i];
        if (el) {
          el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9999] opacity-0 transition-opacity duration-300"
      aria-hidden="true"
    >
      {ICONS.map((Icon, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="absolute left-0 top-0"
          style={{ transform: "translate(-100px, -100px)" }}
        >
          <Icon />
        </div>
      ))}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-3 w-3 rounded-full"
        style={{ background: "#FF2D2D", transform: "translate(-100px, -100px)" }}
      />
    </div>
  );
}
