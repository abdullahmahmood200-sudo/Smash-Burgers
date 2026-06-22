"use client";

import Link from "next/link";
import { useCart } from "./cart/CartProvider";

export default function Nav({ variant = "home" }: { variant?: "home" | "menu" }) {
  const { count, openCart } = useCart();

  return (
    <nav
      aria-label="primary"
      className="relative z-50 flex items-center justify-between px-6 py-6 md:px-10"
    >
      <Link
        href="/"
        data-cursor
        className="-rotate-3 font-poster text-[clamp(30px,3.2vw,48px)] tracking-wide text-red [text-shadow:3px_3px_0_#fff]"
      >
        SMASH
      </Link>

      <div className="flex items-center gap-3">
        <button
          data-cursor
          onClick={openCart}
          aria-label="Open cart"
          className="relative flex items-center gap-2 rounded-full bg-red px-5 py-3 font-poster text-[clamp(13px,1.05vw,17px)] tracking-wide text-white md:px-7"
        >
          CART
          {count > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-yellow-bright px-1.5 text-sm font-bold text-red">
              {count}
            </span>
          )}
        </button>

        {variant === "home" ? (
          <Link
            href="/menu"
            data-cursor
            className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border-2 border-red bg-transparent px-6 py-3 font-poster text-[clamp(13px,1.05vw,17px)] tracking-wide text-red"
          >
            MENU
            <span className="flex flex-col justify-center gap-[3px]">
              <span className="block h-[2.5px] w-[17px] rounded bg-red" />
              <span className="block h-[2.5px] w-[17px] rounded bg-red" />
              <span className="block h-[2.5px] w-[17px] rounded bg-red" />
            </span>
          </Link>
        ) : (
          <Link
            href="/"
            data-cursor
            className="rounded-full bg-red px-6 py-3 font-poster text-[clamp(13px,1.05vw,17px)] tracking-wide text-white md:px-7"
          >
            HOME
          </Link>
        )}
      </div>
    </nav>
  );
}
