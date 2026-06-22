"use client";

import { useEffect, useRef } from "react";

/** Trailing ring + dot cursor. The ring tints toward gold over red backgrounds
 *  and grows over interactive elements. Disabled on touch / coarse pointers. */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine =
      window.matchMedia &&
      window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (!fine) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.body.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let shown = false;
    let onRed = false;
    let raf = 0;

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

    const applyColor = (color: "yellow" | "red") => {
      const c = color === "yellow" ? "#FFD23F" : "#E8190B";
      ring.style.borderColor = c;
      dot.style.background = c;
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
      if (!shown) {
        shown = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      const color = getBgColor(mx, my);
      onRed = color === "yellow";
      applyColor(color);
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && t.closest("a,button,[data-cursor],input,textarea,select");

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) {
        ring.style.width = "70px";
        ring.style.height = "70px";
        ring.style.background = onRed
          ? "rgba(255,210,63,.15)"
          : "rgba(232,25,11,.12)";
      }
    };
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target)) {
        ring.style.width = "40px";
        ring.style.height = "40px";
        ring.style.background = "transparent";
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99998] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-red opacity-0 transition-[opacity,width,height,background] duration-300"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red opacity-0 transition-opacity duration-300"
      />
    </>
  );
}
