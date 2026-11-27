"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { load, save } from "@/lib/storage";

type WishlistContextValue = {
  ids: string[];
  hydrated: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const KEY = "ho-wishlist-v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = load<unknown>(KEY, []);
    // Browser-only storage is read after mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : []);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(KEY, ids);
  }, [ids, hydrated]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== KEY || !event.newValue) return;
      try {
        const value = JSON.parse(event.newValue) as unknown;
        setIds(Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []);
      } catch { setIds([]); }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }, []);

  const value = useMemo(() => ({
    ids,
    hydrated,
    has: (id: string) => ids.includes(id),
    toggle,
    clear: () => setIds([]),
  }), [ids, hydrated, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
