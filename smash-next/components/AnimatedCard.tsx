"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.22, 1.2, 0.36, 1] as [number, number, number, number], // overshoot spring curve
    },
  }),
};

/**
 * Scroll-triggered staggered reveal wrapper. Only animates transform + opacity,
 * fires once (no re-trigger on scroll back up), and respects reduced-motion via
 * the global CSS override.
 */
export default function AnimatedCard({
  children,
  index = 0,
  className = "",
}: AnimatedCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
    >
      {children}
    </motion.div>
  );
}
