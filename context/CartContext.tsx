"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import promoCodesData from "@/src/data/promoCodes.json";
import { products } from "@/lib/catalog";
import { cartReducer, computeTotals, hydrateCartItems, MAX_QTY, type CartState } from "@/lib/cart";
import { formatPrice } from "@/lib/money";
import { load, save, storageAvailable } from "@/lib/storage";
import type { CartItem, Promo, Totals } from "@/lib/types";
import { useUI } from "./UIContext";

const promoCodes = promoCodesData as Promo[];
const CART_KEY = "ho-cart-v1";
const emptyState: CartState = { items: [], promoCode: null, drawerOpen: false };

type CartContextValue = CartState & {
  count: number;
  totals: Totals;
  promo: Promo | null;
  storageWarning: boolean;
  addItem: (item: Omit<CartItem, "key">, openDrawer?: boolean) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const { toast } = useUI();

  useEffect(() => {
    const stored = load<{ items?: unknown; promoCode?: unknown }>(CART_KEY, {});
    const promoCode = typeof stored.promoCode === "string" ? stored.promoCode : null;
    dispatch({ type: "HYDRATE", items: hydrateCartItems(stored, products), promoCode });
    // Browser-only storage is read after mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorageWarning(!storageAvailable());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !save(CART_KEY, { items: state.items, promoCode: state.promoCode })) {
      // Surface a failed write to the external browser store.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageWarning(true);
    }
  }, [hydrated, state.items, state.promoCode]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_KEY || !event.newValue) return;
      try {
        const stored = JSON.parse(event.newValue) as { items?: unknown; promoCode?: unknown };
        dispatch({
          type: "HYDRATE",
          items: hydrateCartItems(stored, products),
          promoCode: typeof stored.promoCode === "string" ? stored.promoCode : null,
        });
      } catch {
        dispatch({ type: "HYDRATE", items: [], promoCode: null });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const count = state.items.reduce((sum, item) => sum + item.qty, 0);
  const promo = useMemo(
    () => promoCodes.find((item) => item.code.toLowerCase() === state.promoCode?.toLowerCase()) ?? null,
    [state.promoCode],
  );
  const totals = useMemo(() => computeTotals(state.items, promo), [state.items, promo]);

  const addItem = useCallback((item: Omit<CartItem, "key">, openDrawer = true) => {
    const key = `${item.productId}::${item.variantId ?? "default"}`;
    const currentQty = state.items.find((line) => line.key === key)?.qty ?? 0;
    if (currentQty >= MAX_QTY) {
      toast("Maximum 10 per item.");
      return;
    }
    dispatch({ type: "ADD", item: { ...item, qty: Math.max(1, Math.min(item.qty, MAX_QTY - currentQty)) }, openDrawer });
    toast(`${item.title} added to cart.`);
  }, [state.items, toast]);

  const removeItem = useCallback((key: string) => {
    const removed = state.items.find((item) => item.key === key);
    dispatch({ type: "REMOVE", key });
    if (removed) toast(`${removed.title} removed.`, { label: "Undo", onClick: () => addItem(removed, false) });
  }, [state.items, toast, addItem]);

  const setQty = useCallback((key: string, qty: number) => dispatch({ type: "SET_QTY", key, qty }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openDrawer = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);

  const applyPromo = useCallback((rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const match = promoCodes.find((item) => item.code === code);
    if (!match) return { ok: false, message: "Code not valid." };
    if (totals.subtotal < match.minSubtotal) {
      return { ok: false, message: `Add ${formatPrice(match.minSubtotal - totals.subtotal)} more to use this code.` };
    }
    dispatch({ type: "APPLY_PROMO", code: match.code });
    return { ok: true, message: `${match.code} applied.` };
  }, [totals.subtotal]);

  const value = useMemo<CartContextValue>(() => ({
    ...state,
    count,
    totals,
    promo,
    storageWarning,
    addItem,
    removeItem,
    setQty,
    clear,
    applyPromo,
    removePromo: () => dispatch({ type: "APPLY_PROMO", code: null }),
    openDrawer,
    closeDrawer,
  }), [state, count, totals, promo, storageWarning, addItem, removeItem, setQty, clear, applyPromo, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
