"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks: { label: string; href: string }[] = [
  { label: "Menu", href: "/menu" },
  { label: "Burgers", href: "/#flagships" },
  { label: "Delivery", href: "/#travels" },
  { label: "Locations", href: "/#locations" },
];

const sheetVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 28,
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.06, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger trigger (mobile only) */}
      <button
        className="flex flex-col items-end gap-[5px] p-2 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{ touchAction: "manipulation" }}
      >
        <span className="block h-[2.5px] w-6 rounded bg-red" />
        <span className="block h-[2.5px] w-6 rounded bg-red" />
        <span className="block h-[2.5px] w-4 rounded bg-red" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setOpen(false)}
            />

            {/* Bottom sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[61] rounded-t-[28px] bg-ink px-6 pb-10 pt-4"
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ willChange: "transform" }}
            >
              {/* Drag handle */}
              <div className="mx-auto mb-8 h-1 w-10 rounded-full bg-white/20" />

              {/* Nav links */}
              <nav className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-white/10 py-3 font-display text-3xl tracking-tight text-cream"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* CTA inside sheet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35 }}
                className="mt-8"
              >
                <a
                  href="/menu"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-2xl bg-red py-4 text-center font-poster text-lg tracking-wide text-white"
                >
                  ORDER NOW
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
