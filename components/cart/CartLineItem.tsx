"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { StoreImage } from "@/components/ui/StoreImage";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/money";
import type { CartItem } from "@/lib/types";

export function CartLineItem({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { setQty, removeItem } = useCart();
  const { has, toggle } = useWishlist();
  const saveForLater = () => {
    if (!has(item.productId)) toggle(item.productId);
    removeItem(item.key);
  };
  return (
    <article className={`flex gap-3 border-b border-line py-4 ${compact ? "" : "sm:gap-5"}`}>
      <Link href={`/p/${item.slug}`} className={`relative shrink-0 overflow-hidden rounded-sm bg-surface ${compact ? "h-24 w-20" : "h-28 w-24 sm:h-32 sm:w-28"}`}><StoreImage src={item.image} alt={item.title} sizes={compact ? "80px" : "112px"} /></Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div><Link href={`/p/${item.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-primary hover:underline sm:text-base">{item.title}</Link>{item.variantLabel && <p className="mt-0.5 text-xs text-muted">{item.variantLabel}</p>}</div>
          <button type="button" className="icon-button -mr-2 -mt-2 min-h-11 min-w-11 shrink-0" onClick={() => removeItem(item.key)} aria-label={`Remove ${item.title} from cart`}><Trash2 className="h-4 w-4" /></button>
        </div>
        {item.previousUnitPrice !== undefined && item.previousUnitPrice !== item.unitPrice && <p className="mt-1 text-xs text-warning-text">Price updated from {formatPrice(item.previousUnitPrice)}</p>}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
          <QuantityStepper value={item.qty} onChange={(qty) => setQty(item.key, qty)} label={item.title} compact />
          <div className="text-right"><p className="text-sm font-bold sm:text-base">{formatPrice(item.unitPrice * item.qty)}</p>{!compact && <button type="button" onClick={saveForLater} className="mt-1 flex min-h-9 items-center gap-1 text-xs text-muted hover:text-primary hover:underline"><Heart className="h-3.5 w-3.5" /> Save for later</button>}</div>
        </div>
      </div>
    </article>
  );
}
