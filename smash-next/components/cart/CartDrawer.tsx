"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import type { FulfillmentType } from "@/lib/types";

type Step = "cart" | "checkout" | "done";

const money = (n: number) => `$${n.toFixed(2)}`;

export default function CartDrawer() {
  const { lines, count, subtotal, isOpen, closeCart, setQty, remove, clear } =
    useCart();
  const [step, setStep] = useState<Step>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");

  // Reset to the cart view whenever the drawer is opened fresh.
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (step === "done") setStep("cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Lock body scroll while open.
  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      customer_name: String(fd.get("name") || ""),
      customer_email: String(fd.get("email") || ""),
      customer_phone: String(fd.get("phone") || ""),
      fulfillment_type: fulfillment,
      address: String(fd.get("address") || ""),
      notes: String(fd.get("notes") || ""),
      items: lines.map((l) => ({ menu_item_id: l.id, quantity: l.quantity })),
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setOrderId(data.orderId);
      clear();
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[70000] bg-ink/55 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        aria-label="Cart"
        className={`fixed right-0 top-0 z-[70001] flex h-full w-[min(92vw,440px)] flex-col bg-cream shadow-[-12px_0_44px_rgba(0,0,0,0.3)] transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.5,1.2,.5,1)" }}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b-2 border-red/15 px-6 py-5">
          <h2 className="font-poster text-2xl tracking-wide text-red">
            {step === "checkout" ? "CHECKOUT" : step === "done" ? "YOU'RE SET" : "YOUR ORDER"}
          </h2>
          <button
            data-cursor
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red text-xl text-cream"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === "done" ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 text-6xl">🍔</div>
              <p className="font-display text-3xl leading-none text-red-bright">
                ORDER PLACED!
              </p>
              <p className="mt-4 font-semibold text-ink">
                Thanks — we&apos;re firing up the flat-top.
              </p>
              {orderId && (
                <p className="mt-2 text-sm font-semibold text-cocoa">
                  Confirmation: <span className="font-mono">{orderId.slice(0, 8)}</span>
                </p>
              )}
              <button
                data-cursor
                onClick={closeCart}
                className="mt-8 rounded-full bg-red px-10 py-4 font-poster tracking-wide text-white shadow-[0_6px_0_rgba(0,0,0,0.14)]"
              >
                KEEP BROWSING
              </button>
            </div>
          ) : lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-3xl text-red-bright">EMPTY</p>
              <p className="mt-3 font-semibold text-ink">
                Add a burger to get smashing.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-3 rounded-2xl bg-cream-card p-4 shadow-[0_8px_20px_rgba(42,20,8,0.08)]"
                >
                  <div className="flex-1">
                    <p className="font-display text-xl leading-tight text-red-bright">
                      {l.name}
                    </p>
                    <p className="text-sm font-semibold text-cocoa">
                      {money(l.price)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      data-cursor
                      aria-label={`Decrease ${l.name}`}
                      onClick={() => setQty(l.id, l.quantity - 1)}
                      className="h-8 w-8 rounded-full bg-red font-bold text-white"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-bold text-ink">
                      {l.quantity}
                    </span>
                    <button
                      data-cursor
                      aria-label={`Increase ${l.name}`}
                      onClick={() => setQty(l.id, l.quantity + 1)}
                      className="h-8 w-8 rounded-full bg-red font-bold text-white"
                    >
                      +
                    </button>
                  </div>
                  <button
                    data-cursor
                    aria-label={`Remove ${l.name}`}
                    onClick={() => remove(l.id)}
                    className="ml-1 text-cocoa/70 hover:text-red"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {step === "checkout" && lines.length > 0 && (
            <form id="checkout-form" onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <div className="flex gap-2">
                {(["pickup", "delivery"] as FulfillmentType[]).map((f) => (
                  <button
                    type="button"
                    key={f}
                    data-cursor
                    onClick={() => setFulfillment(f)}
                    className={`flex-1 rounded-full py-3 font-poster text-sm tracking-wide transition-colors ${
                      fulfillment === f
                        ? "bg-red text-white"
                        : "bg-cream-card text-red"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <Input name="name" placeholder="Full name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" placeholder="Phone (optional)" />
              {fulfillment === "delivery" && (
                <Input name="address" placeholder="Delivery address" required />
              )}
              <textarea
                name="notes"
                placeholder="Notes (allergies, no pickles…)"
                rows={2}
                className="rounded-2xl border-2 border-red/20 bg-white px-4 py-3 font-body font-medium text-ink outline-none focus:border-red"
              />
            </form>
          )}
        </div>

        {/* footer */}
        {step !== "done" && lines.length > 0 && (
          <div className="border-t-2 border-red/15 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-poster text-lg tracking-wide text-ink">
                {step === "checkout" ? "TOTAL" : "SUBTOTAL"}
              </span>
              <span className="font-display text-3xl text-red">
                {money(subtotal)}
              </span>
            </div>
            {error && (
              <p className="mb-3 rounded-xl bg-red/10 px-4 py-3 text-sm font-semibold text-red">
                {error}
              </p>
            )}
            {step === "cart" ? (
              <button
                data-cursor
                onClick={() => setStep("checkout")}
                className="w-full rounded-full bg-red py-5 font-poster text-lg tracking-wide text-white shadow-[0_6px_0_rgba(0,0,0,0.14)] transition-transform active:translate-y-1"
              >
                CHECKOUT · {count} {count === 1 ? "ITEM" : "ITEMS"}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  data-cursor
                  onClick={() => setStep("cart")}
                  className="rounded-full bg-cream-card px-6 py-5 font-poster text-sm tracking-wide text-red"
                >
                  BACK
                </button>
                <button
                  data-cursor
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-red py-5 font-poster text-lg tracking-wide text-white shadow-[0_6px_0_rgba(0,0,0,0.14)] transition-transform active:translate-y-1 disabled:opacity-60"
                >
                  {submitting ? "PLACING…" : "PLACE ORDER"}
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function Input({
  name,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="rounded-2xl border-2 border-red/20 bg-white px-4 py-3 font-body font-medium text-ink outline-none focus:border-red"
    />
  );
}
