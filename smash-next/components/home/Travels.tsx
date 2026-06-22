"use client";

import { useEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap";

const ROUTE_D =
  "M50,330 C 230,330 250,90 470,110 C 650,126 660,300 840,250 C 980,212 1010,70 1150,120";

export default function Travels() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    const path = pathRef.current;
    const prog = progRef.current;
    const plane = planeRef.current;
    const wrap = wrapRef.current;
    if (!path || !prog || !plane || !wrap) return;

    const len = path.getTotalLength();
    prog.style.strokeDasharray = String(len);
    prog.style.strokeDashoffset = String(len);

    const place = (p: number) => {
      prog.style.strokeDashoffset = String(len * (1 - p));
      const pt = path.getPointAtLength(len * p);
      const pt2 = path.getPointAtLength(Math.min(len, len * p + 2));
      const ang = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
      plane.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${ang})`);
    };
    place(0);

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 72%",
      end: "bottom 75%",
      scrub: 0.7,
      onUpdate: (self) => place(self.progress),
    });
    ScrollTrigger.refresh();
    return () => st.kill();
  }, []);

  return (
    <section
      id="travels"
      className="relative overflow-hidden bg-yellow-sun px-6 pb-32 pt-24"
    >
      <div className="mx-auto max-w-[1000px] text-center">
        <div className="font-poster text-[clamp(16px,1.8vw,26px)] tracking-[2px] text-red">
          HOT &amp; DELIVERED
        </div>
        <h2 className="mb-0 mt-3 font-display text-[clamp(48px,8.2vw,150px)] leading-[0.86] tracking-tight text-[#1F1206] [text-shadow:4px_4px_0_#fff]">
          QUALITY THAT
          <br />
          TRAVELS WITH YOU
        </h2>
        <p className="mx-auto mt-7 max-w-[620px] text-[clamp(18px,1.6vw,28px)] font-semibold leading-snug text-[#5A3A12]">
          From our flat-top to your door — every smash arrives as fresh as the
          second it left the grill.
        </p>
      </div>

      <div ref={wrapRef} className="relative mx-auto mt-16 max-w-[1200px]">
        <svg
          viewBox="0 0 1200 380"
          className="block h-auto w-full overflow-visible"
        >
          <path
            ref={pathRef}
            d={ROUTE_D}
            fill="none"
            stroke="#C28A00"
            strokeWidth={5}
            strokeDasharray="2 20"
            strokeLinecap="round"
          />
          <path
            ref={progRef}
            d={ROUTE_D}
            fill="none"
            stroke="#E8190B"
            strokeWidth={7}
            strokeLinecap="round"
          />
          <circle cx={50} cy={330} r={13} fill="#E8190B" stroke="#fff" strokeWidth={4} />
          <circle cx={1150} cy={120} r={13} fill="#fff" stroke="#E8190B" strokeWidth={5} />
          <g ref={planeRef} transform="translate(50,330)">
            <circle r={26} fill="#fff" />
            <polygon points="-13,-9 16,0 -13,9 -6,0" fill="#E8190B" />
            <polygon points="-13,9 16,0 -6,0" fill="#B11208" />
          </g>
        </svg>
        <div className="mx-auto mt-1.5 flex max-w-[1150px] justify-between px-2.5">
          <div className="font-poster text-[clamp(16px,1.5vw,24px)] text-[#1F1206]">
            OUR KITCHEN
          </div>
          <div className="font-poster text-[clamp(16px,1.5vw,24px)] text-[#1F1206]">
            YOUR DOOR
          </div>
        </div>
      </div>
    </section>
  );
}
