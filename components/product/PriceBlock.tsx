import { formatPrice, formatPriceRange } from "@/lib/money";
import type { Product, Variant } from "@/lib/types";

export function PriceBlock({ product, variant, large = false }: { product: Product; variant?: Variant; large?: boolean }) {
  const price = variant?.price ?? product.price;
  const original = variant?.originalPrice ?? product.originalPrice;
  const max = !variant ? product.priceMax : undefined;
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${large ? "text-3xl font-bold" : "text-xl font-bold"}`}>
      <span className={original ? "text-accent" : "text-ink"}>{max ? formatPriceRange(price, max) : formatPrice(price)}</span>
      {original && <span className={`${large ? "text-lg" : "text-sm"} font-normal text-muted line-through`}>{formatPrice(original)}</span>}
      {product.priceLabel && <span className="text-xs font-normal text-muted">{product.priceLabel}</span>}
    </div>
  );
}
