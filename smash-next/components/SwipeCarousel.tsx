"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface SwipeCarouselProps {
  items: React.ReactNode[];
  cardWidth?: number;
  gap?: number;
}

/**
 * Touch-friendly swipe carousel with velocity-aware snap points and dot
 * indicators. Only animates transform; drag handled natively by Framer Motion.
 */
export default function SwipeCarousel({
  items,
  cardWidth = 280,
  gap = 16,
}: SwipeCarouselProps) {
  // Cards fill the available track width so the active card is always centered
  // within the viewport (a fixed cardWidth leaves the card left-aligned on
  // wider phones). Falls back to the cardWidth prop until measured.
  const containerRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(cardWidth);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Ignore zero-width readings (e.g. while the element is laid out in a
    // hidden/offscreen state) so the cards never collapse to 0.
    const measure = () => {
      if (el.clientWidth > 0) setTrackWidth(el.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const snapUnit = trackWidth + gap;
  const x = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalWidth = items.length * snapUnit;

  const snapTo = (index: number) => {
    setActiveIndex(index);
    animate(x, -(index * snapUnit), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  // Keep the active card aligned when the track is (re)measured or resized.
  useEffect(() => {
    x.set(-(activeIndex * snapUnit));
  }, [snapUnit, activeIndex, x]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    let newIndex = activeIndex;
    if (offset < -50 || velocity < -300) {
      newIndex = Math.min(activeIndex + 1, items.length - 1);
    } else if (offset > 50 || velocity > 300) {
      newIndex = Math.max(activeIndex - 1, 0);
    }
    snapTo(newIndex);
  };

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        style={{ x, gap, willChange: "transform" }}
        drag="x"
        dragConstraints={{ left: -(totalWidth - snapUnit), right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {items.map((item, i) => (
          <div key={i} className="flex-shrink-0" style={{ width: trackWidth }}>
            {item}
          </div>
        ))}
      </motion.div>

      {/* Dot indicators */}
      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to item ${i + 1}`}
            onClick={() => snapTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-5 bg-red" : "w-2 bg-ink/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
