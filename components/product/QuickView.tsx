"use client";

import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { StoreImage } from "@/components/ui/StoreImage";
import { PriceBlock } from "@/components/product/PriceBlock";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { useWishlist } from "@/context/WishlistContext";
import { save } from "@/lib/storage";

export function QuickView() {
  const { quickView: product, setQuickView } = useUI();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [variantId, setVariantId] = useState("");
  const [error, setError] = useState("");
  const [notify, setNotify] = useState(false);
  const [email, setEmail] = useState("");

  if (!product) return null;
  const variant = product.variants?.find((item) => item.id === variantId);
  const close = () => { setQuickView(null); setVariantId(""); setError(""); setNotify(false); setEmail(""); };

  const add = () => {
    if (product.variants?.length && !variant) { setError("Please select an option."); return; }
    if (!product.inStock || (variant && !variant.inStock)) return;
    addItem({ productId: product.id, variantId: variant?.id, slug: product.slug, title: product.title, image: variant?.image ?? product.images[0]?.src ?? "", unitPrice: variant?.price ?? product.price, qty: 1, variantLabel: variant?.label });
    close();
  };

  return (
    <Overlay open={!!product} onClose={close} title="Quick view" className="overflow-y-auto">
      <div className="grid gap-6 p-5 md:grid-cols-2 md:p-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface"><StoreImage src={variant?.image ?? product.images[0]?.src ?? ""} alt={product.images[0]?.alt ?? product.title} sizes="(max-width: 768px) 100vw, 50vw" /></div>
        <div>
          <h3 className="font-heading text-2xl font-semibold leading-tight">{product.title}</h3>
          <div className="mt-2"><Rating rating={product.rating} count={product.reviewCount} /></div>
          <div className="mt-4"><PriceBlock product={product} variant={variant} /></div>
          <p className="mt-4 line-clamp-4 text-sm text-muted">{product.description}</p>
          {product.variants?.length ? (
            <div className="mt-5"><label htmlFor="quick-variant" className="label">Choose an option</label><select id="quick-variant" className="field" value={variantId} onChange={(event) => { setVariantId(event.target.value); setError(""); }} aria-invalid={!!error}><option value="">Select an option</option>{product.variants.map((item) => <option key={item.id} value={item.id} disabled={!item.inStock}>{item.label}{!item.inStock ? " — Sold out" : ""}</option>)}</select>{error && <p className="field-error" role="alert">{error}</p>}</div>
          ) : null}
          {!product.inStock && !notify ? <Button variant="secondary" className="mt-5 w-full" onClick={() => setNotify(true)}>Notify me</Button> : notify ? (
            <form className="mt-5" onSubmit={(event) => { event.preventDefault(); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { save(`ho-notify-${product.id}`, email); setNotify(false); } }}><label htmlFor="notify-email" className="label">Email for availability</label><input id="notify-email" type="email" required className="field" value={email} onChange={(event) => setEmail(event.target.value)} /><Button type="submit" className="mt-2 w-full">Save my interest</Button></form>
          ) : <div className="mt-5 flex gap-2"><Button className="flex-1" onClick={add}><Plus className="h-4 w-4" /> Add to cart</Button><Button variant="secondary" className="w-12 px-0" aria-label={`${has(product.id) ? "Remove from" : "Add to"} wishlist`} aria-pressed={has(product.id)} onClick={() => toggle(product.id)}><Heart className={`h-5 w-5 ${has(product.id) ? "fill-accent text-accent" : ""}`} /></Button></div>}
        </div>
      </div>
    </Overlay>
  );
}
