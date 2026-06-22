"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { CartLine, MenuItem } from "@/lib/types";

const STORAGE_KEY = "smash-cart-v1";

type Action =
  | { type: "add"; item: MenuItem }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const existing = state.find((l) => l.id === action.item.id);
      if (existing) {
        return state.map((l) =>
          l.id === action.item.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [
        ...state,
        {
          id: action.item.id,
          slug: action.item.slug,
          name: action.item.name,
          price: action.item.price,
          quantity: 1,
        },
      ];
    }
    case "remove":
      return state.filter((l) => l.id !== action.id);
    case "setQty":
      if (action.quantity <= 0) return state.filter((l) => l.id !== action.id);
      return state.map((l) =>
        l.id === action.id ? { ...l, quantity: action.quantity } : l
      );
    case "clear":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) as CartLine[] });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const add = useCallback((item: MenuItem) => {
    dispatch({ type: "add", item });
    setIsOpen(true);
  }, []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const setQty = useCallback(
    (id: string, quantity: number) => dispatch({ type: "setQty", id, quantity }),
    []
  );
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      add,
      remove,
      setQty,
      clear,
    };
  }, [lines, isOpen, openCart, closeCart, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
