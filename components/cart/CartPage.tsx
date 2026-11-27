"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Overlay } from "@/components/ui/Overlay";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/catalog";

export function CartPage() {
  const { items, count, clear, totals } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const afterDiscount = totals.subtotal - totals.discount;
  const clearCart = () => {
    clear();
    setConfirmClear(false);
    window.setTimeout(() => document.getElementById("cart-empty-title")?.focus(), 0);
  };

  if (!items.length) {
    return (
      <div className="section container-shell text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-primary" strokeWidth={1.2} />
        <h1 id="cart-empty-title" tabIndex={-1} className="mt-5 font-heading text-4xl font-semibold">Your cart is empty</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">There’s plenty of room for something wonderful. Explore our most-loved pieces.</p>
        <ButtonLink href="/collections/best-sellers" className="mt-6">Start shopping</ButtonLink>
        <div className="mt-14 text-left">
          <h2 className="mb-5 font-heading text-3xl font-semibold">You may also like</h2>
          <ProductCarousel products={products.slice(0, 8)} label="Recommended products" />
        </div>
      </div>
    );
  }

  const recommendations = products.filter((product) => !items.some((item) => item.productId === product.id)).slice(0, 8);

  return (
    <div className="section container-shell pt-8">
      <Link href="/collections/best-sellers" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Continue shopping
      </Link>
      <div className="mb-7 flex items-center justify-between gap-4">
        <h1 className="font-heading text-4xl font-semibold">
          Shopping Cart <span className="text-2xl font-normal text-muted">({count} {count === 1 ? "item" : "items"})</span>
        </h1>
        <button type="button" className="hidden min-h-11 items-center gap-2 text-sm text-muted hover:text-danger sm:flex" onClick={() => setConfirmClear(true)}>
          <Trash2 className="h-4 w-4" /> Clear cart
        </button>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section aria-label="Cart items">
          {items.map((item) => <CartLineItem key={item.key} item={item} />)}
          <button type="button" className="mt-4 min-h-11 text-sm text-muted underline sm:hidden" onClick={() => setConfirmClear(true)}>Clear cart</button>
        </section>
        <OrderSummary action={<ButtonLink href="/checkout" className="w-full">Continue to checkout</ButtonLink>} />
      </div>
      {afterDiscount < 99900 && (
        <p className="mt-5 text-sm text-muted">Add more to your cart to qualify for free delivery. <Link href="/collections/deals" className="text-link">Explore deals</Link></p>
      )}
      <section className="mt-14" aria-labelledby="cart-recommendations">
        <h2 id="cart-recommendations" className="mb-5 font-heading text-3xl font-semibold">You may also like</h2>
        <ProductCarousel products={recommendations} label="Cart recommendations" />
      </section>
      <Overlay open={confirmClear} onClose={() => setConfirmClear(false)} title="Clear your cart?">
        <div className="p-6">
          <p className="text-muted">This will remove all {count} items from your cart. You can add them again at any time.</p>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirmClear(false)}>Keep shopping</Button>
            <Button className="flex-1 !border-danger !bg-danger" onClick={clearCart}>Clear cart</Button>
          </div>
        </div>
      </Overlay>
    </div>
  );
}
