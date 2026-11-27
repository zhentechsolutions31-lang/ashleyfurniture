"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

export function ProductCarousel({ products, label }: { products: Product[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .8, behavior: "smooth" });
  if (!products.length) return null;
  return (
    <section aria-label={label} aria-roledescription="carousel" className="relative">
      <div className="mb-5 flex items-center justify-end gap-2">
        <button type="button" className="icon-button border border-line bg-white" aria-label={`Previous ${label}`} onClick={() => scroll(-1)}><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" className="icon-button border border-line bg-white" aria-label={`Next ${label}`} onClick={() => scroll(1)}><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div ref={ref} className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {products.map((product) => <div key={product.id} className="w-[82%] shrink-0 snap-start sm:w-[46%] md:w-[31%] lg:w-[calc(25%-.75rem)]"><ProductCard product={product} /></div>)}
      </div>
    </section>
  );
}
