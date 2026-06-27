"use client";

import { useRef, useState } from "react";

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** Detection-zone wrapper: pulls its child toward the cursor (max 20px) when
 *  the pointer is within 80px of the child's center. No styling of the child. */
export default function MagneticButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const el = zoneRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    if (Math.hypot(dx, dy) < 80) {
      setT({ x: clamp(dx * 0.4, -20, 20), y: clamp(dy * 0.4, -20, 20) });
    } else {
      setT({ x: 0, y: 0 });
    }
  };

  const onLeave = () => setT({ x: 0, y: 0 });

  return (
    <div
      ref={zoneRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative inline-block ${className}`}
    >
      <div
        style={{
          transform: `translate(${t.x}px, ${t.y}px)`,
          transition: "transform 0.2s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
