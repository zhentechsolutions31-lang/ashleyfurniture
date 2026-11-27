"use client";

import { CartProvider } from "@/context/CartContext";
import { UIProvider } from "@/context/UIContext";
import { WishlistProvider } from "@/context/WishlistContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </UIProvider>
  );
}
