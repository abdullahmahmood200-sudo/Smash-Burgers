"use client";

import { useState } from "react";
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
  const snapUnit = cardWidth + gap;
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
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        style={{ x, gap, willChange: "transform" }}
        drag="x"
        dragConstraints={{ left: -(totalWidth - snapUnit), right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {items.map((item, i) => (
          <div key={i} className="flex-shrink-0" style={{ width: cardWidth }}>
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
