"use client";

import { useEffect, useRef } from "react";

/** Dot cursor. The dot tints toward gold over red backgrounds.
 *  Disabled on touch / coarse pointers. */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine =
      window.matchMedia &&
      window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (!fine) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.body.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let shown = false;

    const getBgColor = (x: number, y: number): "yellow" | "red" => {
      let node = document.elementFromPoint(x, y) as HTMLElement | null;
      while (node && node !== document.body) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const m = bg.match(/\d+/g);
          if (m) {
            const [r, g, b] = m.map(Number);
            return r > 150 && g < 60 && b < 60 ? "yellow" : "red";
          }
          break;
        }
        node = node.parentElement;
      }
      return "red";
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
      if (!shown) {
        shown = true;
        dot.style.opacity = "1";
      }
      const color = getBgColor(mx, my);
      dot.style.background = color === "yellow" ? "#FFD23F" : "#E8190B";
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[99999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red opacity-0 transition-opacity duration-300"
    />
  );
}
