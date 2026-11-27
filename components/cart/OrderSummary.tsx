"use client";

import { LockKeyhole, RotateCcw, ShieldCheck } from "lucide-react";
import { PromoCodeForm } from "./PromoCodeForm";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";

export function OrderSummary({ showPromo = true, action }: { showPromo?: boolean; action?: React.ReactNode }) {
  const { totals, promo, count } = useCart();
  return (
    <aside className="card p-5 lg:sticky lg:top-40" aria-label="Order summary">
      <h2 className="font-heading text-2xl font-semibold">Order summary</h2>
      <p className="mt-1 text-sm text-muted">{count} {count === 1 ? "item" : "items"}</p>
      {showPromo && <div className="my-5 border-y border-line py-5"><PromoCodeForm /></div>}
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd className="font-semibold">{formatPrice(totals.subtotal)}</dd></div>
        {totals.discount > 0 && <div className="flex justify-between gap-4 text-success"><dt>Discount {promo ? `(${promo.code})` : ""}</dt><dd>−{formatPrice(totals.discount)}</dd></div>}
        <div className="flex justify-between gap-4"><dt>Shipping</dt><dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd></div>
        <div className="flex justify-between gap-4"><dt>Estimated tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
        <div className="flex justify-between gap-4 border-t border-line pt-4 text-xl font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
      </dl>
      <p className="mt-3 text-xs text-muted">As low as {formatPrice(Math.round(totals.total / 24))}/mo for 24 months. Demo estimate only; subject to approval.</p>
      {action && <div className="mt-5">{action}</div>}
      <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs text-muted"><span className="flex items-center gap-1"><LockKeyhole className="h-3.5 w-3.5" /> Secure checkout</span><span className="flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5" /> Easy returns</span><span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Demo only</span></div>
    </aside>
  );
}
