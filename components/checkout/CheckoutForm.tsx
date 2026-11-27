"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, Check, CreditCard, LockKeyhole, MapPin, PackageCheck, Truck } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StoreImage } from "@/components/ui/StoreImage";
import { useCart } from "@/context/CartContext";
import { computeTotals } from "@/lib/cart";
import { formatPrice } from "@/lib/money";
import { getStoredOrders } from "@/lib/orders";
import { save } from "@/lib/storage";
import type { DeliveryDetails, Order } from "@/lib/types";

const initial: DeliveryDetails = { email: "", phone: "", firstName: "", lastName: "", address1: "", address2: "", city: "", state: "", zip: "", deliveryMethod: "standard", paymentMethod: "delivery" };

export function CheckoutForm() {
  const router = useRouter();
  const { items, count, clear, promo } = useCart();
  const [form, setForm] = useState<DeliveryDetails>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitErrorRef = useRef<HTMLParagraphElement>(null);
  const totals = useMemo(() => computeTotals(items, promo, form.deliveryMethod), [items, promo, form.deliveryMethod]);

  useEffect(() => {
    if (submitError) submitErrorRef.current?.focus();
  }, [submitError]);

  const set = (key: keyof DeliveryDetails, value: string) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: "" })); setSubmitError(""); };
  const field = (key: keyof DeliveryDetails, label: string, options?: { type?: string; autoComplete?: string; inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"]; optional?: boolean; placeholder?: string; className?: string }) => <div className={options?.className ?? ""}><label htmlFor={`checkout-${key}`} className="label">{label}{options?.optional && <span className="font-normal text-muted"> (optional)</span>}</label><input id={`checkout-${key}`} type={options?.type ?? "text"} autoComplete={options?.autoComplete} inputMode={options?.inputMode} className="field" placeholder={options?.placeholder} value={String(form[key] ?? "")} onChange={(event) => set(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} />{errors[key] && <p id={`error-${key}`} className="field-error"><AlertCircle className="h-4 w-4" />{errors[key]}</p>}</div>;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.phone && form.phone.replace(/\D/g, "").length !== 10) next.phone = "Enter a 10-digit phone number.";
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.address1.trim()) next.address1 = "Address is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.state.trim()) next.state = "State is required.";
    if (!/^\d{5}$/.test(form.zip)) next.zip = "Enter a 5-digit ZIP code.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) document.getElementById(`checkout-${first}`)?.focus();
    return Object.keys(next).length === 0;
  };

  const placeOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate() || !items.length) return;
    setPlacing(true);
    setSubmitError("");
    window.setTimeout(() => {
      const id = `HO-${Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => byte.toString(36).padStart(2, "0")).join("").slice(0, 8).toUpperCase()}`;
      const delivery: DeliveryDetails = {
        ...form,
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        address1: form.address1.trim(),
        address2: form.address2?.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
      };
      const order: Order = { id, items: items.map((item) => ({ ...item })), totals: { ...totals }, delivery, createdAt: new Date().toISOString(), status: "Confirmed" };
      const saved = save("ho-orders-v1", [order, ...getStoredOrders()].slice(0, 20));
      if (!saved) {
        setPlacing(false);
        setSubmitError("We couldn’t save this demo order in your browser. Your cart is still here. Enable browser storage or free up space, then try again.");
        return;
      }
      clear();
      router.push(`/order/${id}`);
    }, 600);
  };

  if (!items.length) return <div className="section container-shell text-center"><PackageCheck className="mx-auto h-14 w-14 text-primary" /><h1 className="mt-4 font-heading text-4xl font-semibold">Your cart is empty</h1><p className="mt-3 text-muted">Add something to your cart before checking out.</p><ButtonLink href="/collections/best-sellers" className="mt-5">Continue shopping</ButtonLink></div>;

  return (
    <form onSubmit={placeOrder} noValidate className="section container-shell pt-8">
      <Link href="/cart" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" /> Back to cart</Link>
      <h1 className="font-heading text-4xl font-semibold">Checkout</h1>
      <div role="note" className="mt-4 flex items-start gap-3 rounded-md border border-warning-text/30 bg-warning-bg p-4 text-sm text-warning-text"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><p><strong>Demo store.</strong> No real orders are placed and no real payment information is collected. Please use fictional details.</p></div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-5">
          <section className="card p-5 sm:p-6" aria-labelledby="contact-heading"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span><h2 id="contact-heading" className="font-heading text-2xl font-semibold">Contact</h2></div><div className="grid gap-4 sm:grid-cols-2">{field("email", "Email address", { type: "email", autoComplete: "email" })}{field("phone", "Phone", { type: "tel", autoComplete: "tel", optional: true, placeholder: "10-digit phone" })}</div></section>
          <section className="card p-5 sm:p-6" aria-labelledby="delivery-heading"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span><h2 id="delivery-heading" className="font-heading text-2xl font-semibold">Delivery</h2></div><div className="grid gap-4 sm:grid-cols-2">{field("firstName", "First name", { autoComplete: "given-name" })}{field("lastName", "Last name", { autoComplete: "family-name" })}{field("address1", "Address line 1", { autoComplete: "address-line1", className: "sm:col-span-2" })}{field("address2", "Address line 2", { autoComplete: "address-line2", optional: true, className: "sm:col-span-2" })}{field("city", "City", { autoComplete: "address-level2" })}{field("state", "State", { autoComplete: "address-level1", placeholder: "e.g. TX" })}{field("zip", "ZIP code", { autoComplete: "postal-code", inputMode: "numeric" })}</div><fieldset className="mt-5"><legend className="label">Delivery method</legend><div className="grid gap-3 sm:grid-cols-2"><label className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${form.deliveryMethod === "standard" ? "border-primary bg-surface" : "border-line"}`}><input type="radio" name="deliveryMethod" value="standard" checked={form.deliveryMethod === "standard"} onChange={() => set("deliveryMethod", "standard")} className="mt-1 accent-primary" /><Truck className="h-5 w-5 text-primary" /><span><strong className="block text-sm">Standard delivery</strong><span className="text-xs text-muted">5–10 business days · demo</span></span></label><label className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${form.deliveryMethod === "pickup" ? "border-primary bg-surface" : "border-line"}`}><input type="radio" name="deliveryMethod" value="pickup" checked={form.deliveryMethod === "pickup"} onChange={() => set("deliveryMethod", "pickup")} className="mt-1 accent-primary" /><MapPin className="h-5 w-5 text-primary" /><span><strong className="block text-sm">Store pickup</strong><span className="text-xs text-muted">Ready in 2–3 days · demo</span></span></label></div></fieldset></section>
          <section className="card p-5 sm:p-6" aria-labelledby="payment-heading"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">3</span><h2 id="payment-heading" className="font-heading text-2xl font-semibold">Payment (demo)</h2></div><div className="space-y-3"><label className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${form.paymentMethod === "delivery" ? "border-primary bg-surface" : "border-line"}`}><input type="radio" name="payment" checked={form.paymentMethod === "delivery"} onChange={() => set("paymentMethod", "delivery")} className="mt-1 accent-primary" /><PackageCheck className="h-5 w-5 text-primary" /><span><strong className="block text-sm">Pay on delivery (demo)</strong><span className="text-xs text-muted">No payment details required.</span></span></label><label className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${form.paymentMethod === "demo-card" ? "border-primary bg-surface" : "border-line"}`}><input type="radio" name="payment" checked={form.paymentMethod === "demo-card"} onChange={() => set("paymentMethod", "demo-card")} className="mt-1 accent-primary" /><CreditCard className="h-5 w-5 text-primary" /><span><strong className="block text-sm">Demo card</strong><span className="text-xs text-muted">Simulated only. No card number is requested or stored.</span></span></label></div></section>
          <section className="card p-5 sm:p-6" aria-labelledby="review-heading"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">4</span><h2 id="review-heading" className="font-heading text-2xl font-semibold">Review your order</h2></div><div className="divide-y divide-line">{items.map((item) => <div key={item.key} className="flex gap-3 py-3"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-surface"><StoreImage src={item.image} alt="" sizes="64px" /></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-semibold">{item.title}</p><p className="text-xs text-muted">{item.variantLabel ? `${item.variantLabel} · ` : ""}Qty {item.qty}</p></div><p className="text-sm font-semibold">{formatPrice(item.unitPrice * item.qty)}</p></div>)}</div><Button type="submit" className="mt-6 w-full" disabled={placing} aria-busy={placing}>{placing ? "Placing your demo order…" : `Place demo order — ${formatPrice(totals.total)}`}</Button>{submitError && <p ref={submitErrorRef} id="checkout-submit-error" className="mt-3 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger" role="alert" tabIndex={-1}>{submitError}</p>}<p className="mt-3 flex items-center justify-center gap-1 text-xs text-muted"><LockKeyhole className="h-3.5 w-3.5" /> No real charge. No payment information is collected.</p></section>
        </div>
        <aside className="card p-5 lg:sticky lg:top-40" aria-label="Checkout summary"><h2 className="font-heading text-2xl font-semibold">Order summary</h2><p className="mt-1 text-sm text-muted">{count} {count === 1 ? "item" : "items"}</p><dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>{totals.discount > 0 && <div className="flex justify-between text-success"><dt>Discount {promo?.code}</dt><dd>−{formatPrice(totals.discount)}</dd></div>}<div className="flex justify-between"><dt>Shipping</dt><dd>{totals.shipping ? formatPrice(totals.shipping) : "Free"}</dd></div><div className="flex justify-between"><dt>Estimated tax</dt><dd>{formatPrice(totals.tax)}</dd></div><div className="flex justify-between border-t border-line pt-4 text-xl font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div></dl><div className="mt-5 rounded-sm bg-surface p-4 text-sm"><p className="flex items-center gap-2 font-semibold"><Check className="h-4 w-4 text-success" /> Easy 30-day returns</p><p className="mt-2 text-xs text-muted">Return eligible items in original condition. Demo policy only.</p></div></aside>
      </div>
    </form>
  );
}
