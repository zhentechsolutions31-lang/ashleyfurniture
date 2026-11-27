import { Star } from "lucide-react";

export function Rating({ rating, count, showCount = true }: { rating: number; count?: number; showCount?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm" aria-label={count === undefined ? `${rating} out of 5 stars` : `${rating} out of 5 stars from ${count} reviews`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? "fill-gold text-gold" : "fill-surface text-line"}`} strokeWidth={1.5} />
        ))}
      </span>
      {showCount && <span className="text-muted">{count === undefined ? rating.toFixed(1) : `(${count})`}</span>}
    </span>
  );
}
