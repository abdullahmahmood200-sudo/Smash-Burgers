"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";

interface TapTargetProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

/**
 * Physical press feedback for any interactive element. Pointer events cover both
 * touch and mouse; touchAction: "manipulation" kills the 300ms tap delay.
 * GSAP-only (never pair with Framer Motion on the same element).
 */
export default function TapTarget({
  children,
  className = "",
  scale = 0.94,
}: TapTargetProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePress = () => {
    gsap.to(ref.current, {
      scale,
      duration: 0.12,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleRelease = () => {
    gsap.to(ref.current, {
      scale: 1,
      duration: 0.4,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onPointerDown={handlePress}
      onPointerUp={handleRelease}
      onPointerLeave={handleRelease}
      onPointerCancel={handleRelease}
      style={{ touchAction: "manipulation", userSelect: "none" }}
    >
      {children}
    </div>
  );
}
