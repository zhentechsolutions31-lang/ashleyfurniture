"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Heart, Plus, Search } from "lucide-react";
import { Badge } from "./Badge";
import { PriceBlock } from "./PriceBlock";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { StoreImage } from "@/components/ui/StoreImage";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { setQuickView } = useUI();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const saved = has(product.id);
  const secondImage = product.images[1]?.src;

  const quickAdd = () => {
    if (!product.inStock) return;
    addItem({ productId: product.id, slug: product.slug, title: product.title, image: product.images[0]?.src ?? "", unitPrice: product.price, qty: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Link href={`/p/${product.slug}`} className="absolute inset-0" aria-label={`View ${product.title}`}>
          <StoreImage src={product.images[0]?.src ?? "/images/photos/categories/living-room.webp"} alt={product.images[0]?.alt ?? product.title} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="transition-opacity duration-200 group-hover:opacity-0" />
          {secondImage && <StoreImage src={secondImage} alt="" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100" />}
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex max-w-[calc(100%-3.5rem)] flex-wrap gap-1">{product.badges.slice(0, 2).map((badge) => <Badge key={badge} type={badge} />)}</div>
        <button type="button" className={`icon-button absolute right-1 top-1 h-11 w-11 bg-white/95 shadow-sm ${saved ? "text-accent" : "text-ink"}`} aria-label={`${saved ? "Remove" : "Save"} ${product.title} ${saved ? "from" : "to"} wishlist`} aria-pressed={saved} onClick={() => toggle(product.id)}><Heart className={`h-5 w-5 ${saved ? "fill-accent" : ""}`} /></button>
        <button type="button" className="absolute bottom-2 left-1/2 hidden min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-sm bg-white/95 px-4 text-sm font-semibold text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 md:flex" onClick={() => setQuickView(product)}><Search className="h-4 w-4" /> Quick view</button>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="min-h-12 text-sm font-semibold leading-6 sm:text-[15px]"><Link href={`/p/${product.slug}`} className="line-clamp-2 hover:text-primary hover:underline">{product.title}</Link></h3>
        <div className="mt-1"><Rating rating={product.rating} count={product.reviewCount} /></div>
        <div className="mt-2"><PriceBlock product={product} /></div>
        {product.originalPrice && <p className="mt-1 text-xs font-semibold text-accent">Save {formatPrice(product.originalPrice - product.price)}{product.price >= 99900 ? " · Free delivery" : ""}</p>}
        <ul className="mt-3 hidden space-y-1 text-xs text-muted lg:block">{product.shortFeatures.slice(0, 2).map((feature) => <li key={feature} className="flex gap-1.5"><span aria-hidden="true">•</span><span className="line-clamp-1">{feature}</span></li>)}</ul>
        <div className="mt-auto pt-4">
          {product.variants?.length ? (
            <ButtonLink href={`/p/${product.slug}`} variant="secondary" className="w-full">Select options</ButtonLink>
          ) : !product.inStock ? (
            <Button variant="secondary" className="w-full" onClick={() => setQuickView(product)}>Notify me</Button>
          ) : (
            <Button variant={added ? "ghost" : "primary"} className={`w-full ${added ? "text-success" : ""}`} onClick={quickAdd}>{added ? <><Check className="h-4 w-4" /> Added</> : <><Plus className="h-4 w-4" /> Add to cart</>}</Button>
          )}
        </div>
      </div>
    </article>
  );
}
