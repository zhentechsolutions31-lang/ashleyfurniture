"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "./CartLineItem";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart";
import { ProductCard } from "@/components/product/ProductCard";

export function CartDrawer() {
  const { items, count, totals, drawerOpen, closeDrawer } = useCart();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    closeDrawer();
  }, [pathname, closeDrawer]);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (totals.subtotal - totals.discount));
  const progress = Math.min(100, ((totals.subtotal - totals.discount) / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Overlay open={drawerOpen} onClose={closeDrawer} title={`Your Cart (${count})`} side="right" className="overflow-hidden">
      {items.length === 0 ? (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="py-8 text-center"><ShoppingBag className="mx-auto h-14 w-14 text-primary" strokeWidth={1.2} /><h3 className="mt-4 font-heading text-2xl font-semibold">Your cart is empty</h3><p className="mt-2 text-sm text-muted">A comfortable home starts with something you love.</p><ButtonLink href="/collections/best-sellers" className="mt-5" onClick={closeDrawer}>Continue shopping</ButtonLink></div>
          <h3 className="mb-4 mt-6 text-sm font-bold">A few favourites to get started</h3>
          <div className="space-y-4">{products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      ) : (
        <>
          <div className="border-b border-line bg-surface px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-medium"><Truck className="h-5 w-5 text-primary" />{remaining > 0 ? `You’re ${formatPrice(remaining)} away from free delivery` : "You’ve unlocked free delivery"}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Progress toward free delivery" aria-valuemin={0} aria-valuemax={FREE_SHIPPING_THRESHOLD} aria-valuenow={Math.min(FREE_SHIPPING_THRESHOLD, totals.subtotal - totals.discount)}><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="flex-1 overflow-y-auto px-5">{items.map((item) => <CartLineItem key={item.key} item={item} compact />)}</div>
          <div className="shrink-0 border-t border-line bg-white p-5 shadow-[0_-4px_16px_rgba(28,25,23,.06)]">
            <div className="flex items-baseline justify-between"><span className="text-sm text-muted">Subtotal</span><strong className="text-xl">{formatPrice(totals.subtotal - totals.discount)}</strong></div>
            <p className="mt-1 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
            <Link href="/checkout" onClick={closeDrawer} className="btn btn-primary mt-4 w-full">Checkout <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/cart" onClick={closeDrawer} className="btn btn-secondary mt-2 w-full">View cart</Link>
          </div>
        </>
      )}
    </Overlay>
  );
}
