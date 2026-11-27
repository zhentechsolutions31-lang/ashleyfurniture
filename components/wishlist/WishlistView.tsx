"use client";

import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/lib/catalog";

export function WishlistView() {
  const { ids, hydrated, clear } = useWishlist();
  const saved = products.filter((product) => ids.includes(product.id));

  return (
    <div className="section container-shell pt-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Saved for later</p>
          <h1 className="mt-2 font-heading text-4xl font-semibold">Your Wishlist</h1>
          <p className="mt-2 text-muted">{saved.length} {saved.length === 1 ? "piece" : "pieces"} you love</p>
        </div>
        {saved.length > 0 && <button type="button" className="min-h-11 shrink-0 text-sm text-muted underline hover:text-primary" onClick={clear}>Clear wishlist</button>}
      </div>
      {!hydrated ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton aspect-[4/5] rounded-md" />)}
        </div>
      ) : saved.length ? (
        <div className="product-grid grid gap-4">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="rounded-lg border border-line bg-surface px-6 py-16 text-center">
          <Heart className="mx-auto h-14 w-14 text-primary" />
          <h2 className="mt-4 font-heading text-3xl font-semibold">Keep your favourites close</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">Tap the heart on any product to save it here. Your wishlist stays in this browser.</p>
          <ButtonLink href="/collections/best-sellers" className="mt-5">Discover best sellers</ButtonLink>
        </div>
      )}
    </div>
  );
}
