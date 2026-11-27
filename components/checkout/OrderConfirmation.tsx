"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Mail, MapPin, Printer, Truck } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StoreImage } from "@/components/ui/StoreImage";
import { NotFoundContent } from "@/components/NotFoundContent";
import { formatPrice } from "@/lib/money";
import { getStoredOrders } from "@/lib/orders";
import type { Order } from "@/lib/types";

export function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // Orders exist only in browser storage and are read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(getStoredOrders().find((item) => item.id === orderId) ?? null);
    setLoaded(true);
  }, [orderId]);
  if (!loaded) return <div className="section container-shell"><div className="skeleton mx-auto h-96 max-w-3xl rounded-lg" /></div>;
  if (!order) return <NotFoundContent />;
  const estimate = new Date(order.createdAt);
  for (let added = 0; added < 7;) { estimate.setDate(estimate.getDate() + 1); if (estimate.getDay() !== 0 && estimate.getDay() !== 6) added += 1; }
  return (
    <div className="section container-shell max-w-5xl pt-8">
      <div className="text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success"><Check className="h-10 w-10" /></span><p className="mt-5 text-xs font-semibold uppercase tracking-[.18em] text-success">Order confirmed</p><h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Thank you, {order.delivery.firstName}!</h1><p className="mx-auto mt-3 max-w-xl text-muted">Your demo order <strong className="text-ink">{order.id}</strong> is confirmed. A confirmation would be sent to <strong className="text-ink">{order.delivery.email}</strong>.</p><p className="mt-2 text-sm text-warning-text">No real order was placed and no payment was taken.</p></div>
      <div className="mt-10 grid items-start gap-6 md:grid-cols-[1fr_320px]">
        <section className="card p-5 sm:p-6" aria-labelledby="order-items"><h2 id="order-items" className="font-heading text-2xl font-semibold">Your items</h2><div className="mt-4 divide-y divide-line">{order.items.map((item) => <div key={item.key} className="flex gap-3 py-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-surface"><StoreImage src={item.image} alt="" sizes="80px" /></div><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{item.title}</h3><p className="text-xs text-muted">{item.variantLabel ? `${item.variantLabel} · ` : ""}Qty {item.qty}</p></div><p className="text-sm font-semibold">{formatPrice(item.unitPrice * item.qty)}</p></div>)}</div><dl className="space-y-2 border-t border-line pt-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.totals.subtotal)}</dd></div>{order.totals.discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd>−{formatPrice(order.totals.discount)}</dd></div>}<div className="flex justify-between"><dt>Shipping</dt><dd>{order.totals.shipping ? formatPrice(order.totals.shipping) : "Free"}</dd></div><div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(order.totals.tax)}</dd></div><div className="flex justify-between border-t border-line pt-3 text-lg font-bold"><dt>Total</dt><dd>{formatPrice(order.totals.total)}</dd></div></dl></section>
        <aside className="space-y-5"><section className="card p-5"><h2 className="flex items-center gap-2 font-heading text-xl font-semibold"><Truck className="h-5 w-5 text-primary" /> Delivery</h2><p className="mt-3 text-sm font-semibold">Estimated {estimate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p><p className="mt-1 text-xs text-muted">Illustrative estimate. No shipment will be sent.</p></section><section className="card p-5"><h2 className="flex items-center gap-2 font-heading text-xl font-semibold"><MapPin className="h-5 w-5 text-primary" /> {order.delivery.deliveryMethod === "pickup" ? "Pickup details" : "Delivery address"}</h2>{order.delivery.deliveryMethod === "pickup" ? <p className="mt-3 text-sm text-muted">Ashley Furniture Store<br />123 Market Street<br />Your city, {order.delivery.state} {order.delivery.zip}</p> : <address className="mt-3 text-sm not-italic text-muted">{order.delivery.firstName} {order.delivery.lastName}<br />{order.delivery.address1}{order.delivery.address2 && <><br />{order.delivery.address2}</>}<br />{order.delivery.city}, {order.delivery.state} {order.delivery.zip}</address>}</section><div className="rounded-md bg-surface p-4 text-sm text-muted"><Mail className="mb-2 h-5 w-5 text-primary" />Your order is saved in this browser under “{order.id}”.</div></aside>
      </div>
      <div className="no-print mt-9 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink href="/collections/new-arrivals">Continue shopping</ButtonLink><Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print order</Button></div>
    </div>
  );
}
