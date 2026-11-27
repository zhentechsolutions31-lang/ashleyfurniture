"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, ChevronLeft, ChevronRight, Heart, MapPin, PackageCheck, Plus, Star, Truck, Wrench, ZoomIn } from "lucide-react";
import { Badge } from "./Badge";
import { PriceBlock } from "./PriceBlock";
import { ProductCarousel } from "./ProductCarousel";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Overlay } from "@/components/ui/Overlay";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Rating } from "@/components/ui/Rating";
import { StoreImage } from "@/components/ui/StoreImage";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { useWishlist } from "@/context/WishlistContext";
import { colorHex, products, relatedProducts } from "@/lib/catalog";
import { formatPrice, savingsPercent } from "@/lib/money";
import { load, save } from "@/lib/storage";
import type { Product } from "@/lib/types";

const tabs = ["Description", "Dimensions", "Materials & Care", "Shipping & Returns", "Reviews"];

function addBusinessDays(date: Date, days: number) {
  const result = new Date(date);
  let remaining = days;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) remaining -= 1;
  }
  return result;
}

export function ProductDetail({ product }: { product: Product }) {
  return <ProductDetailContent key={product.id} product={product} />;
}

function ProductDetailContent({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useUI();
  const { has, toggle } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [options, setOptions] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("Description");
  const [zip, setZip] = useState("");
  const [zipError, setZipError] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [recent, setRecent] = useState<Product[]>([]);
  const [mobileBar, setMobileBar] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [notify, setNotify] = useState(false);
  const addButtonRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const result: Record<string, string[]> = {};
    product.variants?.forEach((variant) => Object.entries(variant.options).forEach(([key, value]) => {
      result[key] = Array.from(new Set([...(result[key] ?? []), value]));
    }));
    return result;
  }, [product]);

  const variant = useMemo(() => product.variants?.find((item) =>
    Object.entries(groups).every(([key]) => item.options[key] === options[key]),
  ), [product, groups, options]);
  const currentPrice = variant?.price ?? product.price;
  const currentOriginal = variant?.originalPrice ?? product.originalPrice;
  const currentImage = activeImage === 0 && variant?.image
    ? variant.image
    : product.images[activeImage]?.src ?? product.images[0]?.src;
  const currentAlt = activeImage === 0 && variant?.image
    ? product.images[1]?.alt ?? product.title
    : product.images[activeImage]?.alt ?? product.title;
  const related = useMemo(() => relatedProducts(product), [product]);
  const saved = has(product.id);

  useEffect(() => {
    const slugs = load<string[]>("ho-recent", []);
    save("ho-recent", [product.slug, ...slugs.filter((slug) => slug !== product.slug)].slice(0, 10));
  }, [product.slug]);

  useEffect(() => {
    const slugs = load<string[]>("ho-recent", []).filter((slug) => slug !== product.slug);
    // Recently viewed items come from browser storage, which is unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(slugs.slice(0, 10).map((slug) => products.find((item) => item.slug === slug)).filter((item): item is Product => !!item));
  }, [product.slug]);

  useEffect(() => {
    const target = addButtonRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setMobileBar(!entry.isIntersecting), { rootMargin: "0px 0px -70px 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const setOption = (key: string, value: string) => {
    setOptions((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const add = () => {
    const missing = Object.keys(groups).find((key) => !options[key]);
    if (missing) {
      setError(`Please choose ${missing === "color" ? "a colour" : missing === "size" || missing === "configuration" ? "a size" : "an option"}.`);
      document.getElementById(`option-${missing}`)?.focus();
      return;
    }
    if (!product.inStock || (variant && !variant.inStock)) return;
    setAdding(true);
    window.setTimeout(() => {
      addItem({ productId: product.id, variantId: variant?.id, slug: product.slug, title: product.title, image: currentImage, unitPrice: currentPrice, qty, variantLabel: variant?.label });
      setAdding(false);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1500);
    }, 400);
  };

  const changeImage = (direction: number) => setActiveImage((value) => (value + direction + product.images.length) % product.images.length);
  const checkDelivery = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setZipError("Enter a valid 5-digit ZIP code.");
      setDeliveryMessage("");
      document.getElementById("delivery-zip")?.focus();
      return;
    }
    setZipError("");
    const from = addBusinessDays(new Date(), 5);
    const to = addBusinessDays(new Date(), 10);
    setDeliveryMessage(`Estimated delivery ${from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}. Demo estimate only.`);
  };

  const tabContent: Record<string, React.ReactNode> = {
    Description: <p className="max-w-3xl leading-relaxed text-muted">{product.description}</p>,
    Dimensions: <div className="max-w-2xl overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Product dimensions</caption><tbody className="divide-y divide-line"><tr><th scope="row" className="py-3 pr-6">Width</th><td>{product.dimensions?.width ?? "—"} in</td></tr><tr><th scope="row" className="py-3 pr-6">Depth</th><td>{product.dimensions?.depth ?? "—"} in</td></tr><tr><th scope="row" className="py-3 pr-6">Height</th><td>{product.dimensions?.height ?? "—"} in</td></tr><tr><th scope="row" className="py-3 pr-6">Weight</th><td>{product.dimensions?.weight ?? "—"} lb</td></tr></tbody></table></div>,
    "Materials & Care": <div className="max-w-3xl space-y-4 text-muted"><p><strong className="text-ink">Materials:</strong> {product.materials.map((material) => material.replace(/-/g, " ")).join(", ")}.</p><p>{product.care ?? "Wipe clean with a soft, damp cloth. Avoid harsh cleaners and prolonged direct sunlight."}</p><p>Assembly: {product.assembly ?? "No assembly required."}</p></div>,
    "Shipping & Returns": <div className="max-w-3xl space-y-3 text-muted"><p>Standard delivery is free on orders over $999 after discounts. Delivery estimates are illustrative and vary by location.</p><p>Unused items in original condition may be returned within 30 days. Assembly and delivery fees may apply to large furniture.</p><Link href="/pages/shipping" className="text-link">Read our shipping policy</Link><span className="mx-2">·</span><Link href="/pages/returns" className="text-link">Returns policy</Link></div>,
    Reviews: <ReviewsPanel product={product} onWrite={() => setReviewsOpen(true)} />,
  };

  return (
    <div className="section pt-6 sm:pt-8">
      <div className="container-shell">
        <Breadcrumbs items={[{ label: product.categoryPath.map((part) => part.replace(/-/g, " ")).find((part) => part !== product.category) ?? "Furniture", href: `/c/${product.categoryPath[0]}` }, { label: product.title }]} />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)] lg:gap-12">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface" tabIndex={0} role="group" aria-label="Product image gallery. Use left and right arrow keys to change image." onKeyDown={(event) => { if (event.key === "ArrowLeft") changeImage(-1); if (event.key === "ArrowRight") changeImage(1); }} onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setZoomOrigin(`${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`); }}>
              <StoreImage src={currentImage} alt={currentAlt} priority={activeImage === 0} sizes="(max-width: 1024px) 100vw, 55vw" className="transition-transform duration-300 hover:scale-125" style={{ transformOrigin: zoomOrigin }} />
              <button type="button" className="icon-button absolute bottom-3 right-3 bg-white/95 shadow-sm" aria-label="Open image zoom" onClick={() => setLightbox(true)}><ZoomIn className="h-5 w-5" /></button>
              <button type="button" className="icon-button absolute left-2 top-1/2 hidden -translate-y-1/2 bg-white/90 sm:flex" aria-label="Previous product image" onClick={() => changeImage(-1)}><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" className="icon-button absolute right-2 top-1/2 hidden -translate-y-1/2 bg-white/90 sm:flex" aria-label="Next product image" onClick={() => changeImage(1)}><ChevronRight className="h-5 w-5" /></button>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2" aria-label="Product image thumbnails">{product.images.map((image, index) => <button key={`${image.src}-${index}`} type="button" className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-sm border-2 ${activeImage === index ? "border-primary" : "border-transparent"}`} aria-label={`Show image ${index + 1}: ${image.alt}`} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)}><StoreImage src={image.src} alt="" priority={index === 0} sizes="96px" /></button>)}</div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">{product.badges.map((badge) => <Badge key={badge} type={badge} />)}{!product.inStock && <Badge type="sale" />}</div>
            <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">{product.title}</h1>
            <p className="mt-2 text-sm text-muted">SKU: {product.id} <span className="mx-2">·</span> <Rating rating={product.rating} count={product.reviewCount} /></p>
            <div className="mt-5"><PriceBlock product={product} variant={variant} large />{currentOriginal && <p className="mt-1 text-sm font-semibold text-success">You save {formatPrice(currentOriginal - currentPrice)} ({savingsPercent(currentPrice, currentOriginal)}%)</p>}</div>
            <p className="mt-3 text-sm text-muted">Special financing may be available. <Link href="/pages/financing" className="text-link">Learn more</Link></p>
            {Object.entries(groups).map(([key, values]) => <fieldset key={key} className="mt-6"><legend className="label">{key === "configuration" ? "Configuration" : key.charAt(0).toUpperCase() + key.slice(1)}: <span className="font-normal text-muted">{options[key] ?? "Select"}</span></legend><div id={`option-${key}`} tabIndex={-1} className="flex flex-wrap gap-2">{key === "color" ? values.map((value) => { const optionVariant = product.variants?.find((item) => item.options[key] === value); const disabled = !optionVariant?.inStock; return <button key={value} type="button" disabled={disabled} aria-label={`${value}${disabled ? " — Sold out" : ""}`} aria-pressed={options[key] === value} onClick={() => setOption(key, value)} className={`flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm ${options[key] === value ? "border-primary bg-surface" : "border-line"} ${disabled ? "line-through opacity-50" : ""}`}><span className="h-6 w-6 rounded-full border border-line" style={{ backgroundColor: colorHex[value.toLowerCase()] ?? "#DDD" }} />{value}</button>; }) : <select className="field max-w-sm" value={options[key] ?? ""} onChange={(event) => setOption(key, event.target.value)} aria-label={key}><option value="">Choose {key}</option>{values.map((value) => { const optionVariant = product.variants?.find((item) => item.options[key] === value); return <option key={value} value={value} disabled={!optionVariant?.inStock}>{value}{!optionVariant?.inStock ? " — Sold out" : ""}</option>; })}</select>}</div></fieldset>)}
            {error && <p className="field-error mt-3" role="alert"><AlertCircle className="h-4 w-4" />{error}</p>}
            <div className="mt-6 flex items-center gap-4"><span className="label mb-0">Quantity</span><QuantityStepper value={qty} onChange={setQty} label={product.title} /></div>
            <div ref={addButtonRef} className="mt-5 flex gap-2">{!product.inStock && !notify ? <Button variant="secondary" className="flex-1" onClick={() => setNotify(true)}>Notify me</Button> : notify ? <form className="flex flex-1 flex-col gap-2" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const email = String(form.get("notify-email") ?? ""); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { save(`ho-notify-${product.id}`, email); setNotify(false); toast("Your interest has been saved in this browser."); } }}><label htmlFor="pdp-notify-email" className="sr-only">Email for availability</label><input id="pdp-notify-email" name="notify-email" type="email" required className="field" placeholder="Email for availability" /><Button type="submit">Save my interest</Button></form> : <Button className={`flex-1 ${added ? "text-success" : ""}`} onClick={add} disabled={adding}>{adding ? "Adding…" : added ? <><Check className="h-5 w-5" /> Added to cart</> : <><Plus className="h-5 w-5" /> Add to cart — {formatPrice(currentPrice * qty)}</>}</Button>}<Button variant="secondary" className="w-14 px-0" aria-label={`${saved ? "Remove from" : "Add to"} wishlist`} aria-pressed={saved} onClick={() => toggle(product.id)}><Heart className={`h-5 w-5 ${saved ? "fill-accent text-accent" : ""}`} /></Button></div>
            <p className="mt-3 flex items-center gap-2 text-sm text-success"><Check className="h-4 w-4" /> {product.inStock ? "In stock and ready to ship" : "Currently sold out"}</p>
            <div className="mt-6 space-y-4 border-y border-line py-5">
              <div className="flex gap-3"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="text-sm font-semibold">Delivery &amp; pickup</h2><form onSubmit={checkDelivery} className="mt-2 flex gap-2"><label htmlFor="delivery-zip" className="sr-only">ZIP code</label><input id="delivery-zip" inputMode="numeric" className="field h-11 max-w-32" placeholder="ZIP code" value={zip} onChange={(event) => { setZip(event.target.value.replace(/\D/g, "").slice(0, 5)); setZipError(""); setDeliveryMessage(""); }} aria-invalid={!!zipError} aria-describedby={zipError ? "delivery-zip-error" : deliveryMessage ? "delivery-message" : undefined} /><Button type="submit" variant="secondary" className="h-11 min-h-11 px-3">Check</Button></form>{zipError && <p id="delivery-zip-error" className="field-error" role="alert"><AlertCircle className="h-4 w-4" />{zipError}</p>}{deliveryMessage && <p id="delivery-message" className="mt-2 text-xs text-muted" role="status">{deliveryMessage}</p>}<p className="mt-2 flex items-center gap-1 text-xs text-muted"><MapPin className="h-3.5 w-3.5" /> Store pickup available</p></div></div>
              <div className="flex gap-3"><Wrench className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="text-sm font-semibold">Assembly</h2><p className="text-sm text-muted">{product.assembly ?? "No assembly required."}</p></div></div>
              {product.includes && <div className="flex gap-3"><PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="text-sm font-semibold">Included pieces</h2><p className="text-sm text-muted">{product.includes}</p></div></div>}
            </div>
            <ul className="mt-5 space-y-2">{product.shortFeatures.map((feature) => <li key={feature} className="flex gap-2 text-sm text-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{feature}</li>)}</ul>
          </div>
        </div>
        <section className="mt-14" aria-label="Product information"><div role="tablist" aria-label="Product details" className="scrollbar-hide flex gap-6 overflow-x-auto border-b border-line">{tabs.map((tab) => <button key={tab} id={`product-tab-${tab.replace(/\W/g, "")}`} role="tab" type="button" aria-selected={activeTab === tab} aria-controls="product-tab-panel" tabIndex={activeTab === tab ? 0 : -1} className={`min-h-14 shrink-0 border-b-2 font-semibold ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted"}`} onClick={() => setActiveTab(tab)} onKeyDown={(event) => { const index = tabs.indexOf(activeTab); if (event.key === "ArrowRight") { event.preventDefault(); const next = tabs[(index + 1) % tabs.length]; setActiveTab(next); document.getElementById(`product-tab-${next.replace(/\W/g, "")}`)?.focus(); } if (event.key === "ArrowLeft") { event.preventDefault(); const next = tabs[(index - 1 + tabs.length) % tabs.length]; setActiveTab(next); document.getElementById(`product-tab-${next.replace(/\W/g, "")}`)?.focus(); } }}>{tab}</button>)}</div><div id="product-tab-panel" role="tabpanel" aria-labelledby={`product-tab-${activeTab.replace(/\W/g, "")}`} className="py-7">{tabContent[activeTab]}</div></section>
        <section className="mt-8" aria-labelledby="related-heading"><h2 id="related-heading" className="mb-5 font-heading text-3xl font-semibold">You may also like</h2><ProductCarousel products={related} label="Related products" /></section>
        {recent.length > 0 && <section className="mt-12" aria-labelledby="recent-heading"><h2 id="recent-heading" className="mb-5 font-heading text-3xl font-semibold">Recently viewed</h2><ProductCarousel products={recent} label="Recently viewed products" /></section>}
      </div>
      <div className={`fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white p-3 shadow-lg lg:hidden ${mobileBar ? "flex" : "hidden"}`}><div className="min-w-0 flex-1"><p className="truncate text-xs text-muted">{product.title}</p><p className="font-bold text-primary">{formatPrice(currentPrice)}</p></div><Button className="shrink-0" onClick={add} disabled={adding}>{adding ? "Adding…" : "Add to cart"}</Button></div>
      <Overlay open={lightbox} onClose={() => setLightbox(false)} title={product.title}><div className="relative aspect-[4/3] bg-surface"><StoreImage src={currentImage} alt={currentAlt} sizes="90vw" /></div><div className="flex items-center justify-between p-4"><button type="button" className="btn btn-secondary" onClick={() => changeImage(-1)}><ChevronLeft className="h-4 w-4" /> Previous</button><span className="text-sm text-muted">{activeImage + 1} / {product.images.length}</span><button type="button" className="btn btn-secondary" onClick={() => changeImage(1)}>Next <ChevronRight className="h-4 w-4" /></button></div></Overlay>
      <Overlay open={reviewsOpen} onClose={() => setReviewsOpen(false)} title="Write a review"><ReviewForm product={product} onSaved={() => { setReviewsOpen(false); toast("Thank you. Your demo review was saved in this browser."); }} /></Overlay>
    </div>
  );
}

function ReviewsPanel({ product, onWrite }: { product: Product; onWrite: () => void }) {
  const reviews = [
    { name: "Jamie L.", rating: 5, title: "Even better in person", text: "The proportions are just right and the finish feels thoughtfully made. It settled into our room beautifully." },
    { name: "Chris M.", rating: 4, title: "Comfortable and considered", text: "A lovely piece with practical details. Delivery and setup were straightforward." },
  ];
  return <div className="grid gap-8 md:grid-cols-[220px_1fr]"><div className="rounded-md bg-surface p-5 text-center"><p className="font-heading text-5xl font-semibold">{product.rating.toFixed(1)}</p><div className="mt-2 flex justify-center gap-1 text-gold" aria-hidden="true">{[1,2,3,4,5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= Math.round(product.rating) ? "fill-gold" : "fill-surface text-line"}`} />)}</div><p className="mt-2 text-sm text-muted">{product.reviewCount} illustrative reviews</p><Button variant="secondary" className="mt-4 w-full" onClick={onWrite}>Write a review</Button></div><div className="space-y-5">{reviews.map((review) => <article key={review.name} className="border-b border-line pb-5"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{review.title}</h3><span className="text-xs text-muted">{review.name}</span></div><div className="mt-1 flex gap-0.5 text-gold" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, index) => <Star key={index} className="h-3.5 w-3.5 fill-gold" />)}</div><p className="mt-2 text-sm leading-relaxed text-muted">{review.text}</p></article>)}</div></div>;
}

function ReviewForm({ product, onSaved }: { product: Product; onSaved: () => void }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  return <form className="space-y-4 p-6" noValidate onSubmit={(event) => { event.preventDefault(); if (!name.trim() || text.trim().length < 10) { setError("Add your name and a review of at least 10 characters."); return; } const current = load<unknown[]>(`ho-reviews-${product.id}`, []); save(`ho-reviews-${product.id}`, [{ name, rating, text, createdAt: new Date().toISOString() }, ...(Array.isArray(current) ? current : [])]); onSaved(); }}><fieldset><legend className="label">Your rating</legend><div className="flex gap-1">{[1,2,3,4,5].map((value) => <button key={value} type="button" className="icon-button" aria-label={`${value} stars`} aria-pressed={rating === value} onClick={() => setRating(value)}><Star className={`h-7 w-7 ${value <= rating ? "fill-gold text-gold" : "text-line"}`} /></button>)}</div></fieldset><div><label htmlFor="review-name" className="label">Name</label><input id="review-name" className="field" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></div><div><label htmlFor="review-text" className="label">Your review</label><textarea id="review-text" className="field min-h-32" value={text} onChange={(event) => setText(event.target.value)} /></div>{error && <p className="field-error" role="alert">{error}</p>}<p className="text-xs text-muted">Saved only in this browser. Demo reviews are not submitted publicly.</p><Button type="submit">Save review</Button></form>;
}
