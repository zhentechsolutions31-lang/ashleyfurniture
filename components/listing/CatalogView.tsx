"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Grid2X2, Grid3X3, SlidersHorizontal, X } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Overlay } from "@/components/ui/Overlay";
import { StoreImage } from "@/components/ui/StoreImage";
import { ProductCard } from "@/components/product/ProductCard";
import { useUI } from "@/context/UIContext";
import { activeFilterLabels, applyFilters, applySort, getFacetCounts, hasActiveFilters, titleCase, type SortOption } from "@/lib/filters";
import { categories, colorHex } from "@/lib/catalog";
import type { Product } from "@/lib/types";

type CatalogViewProps = {
  title: string;
  description: string;
  image?: string;
  products: Product[];
  breadcrumbs: { label: string; href?: string }[];
  categorySlug?: string;
  query?: string;
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "savings", label: "Biggest savings" },
];

const featureLabels: Record<string, string> = {
  "power-recliner": "Power recliner", reversible: "Reversible", storage: "Storage",
  "pet-friendly": "Pet friendly", "usb-port": "USB port", "solid-wood-frame": "Solid wood frame",
  "easy-clean": "Easy clean", "eco-friendly": "Eco friendly", "water-resistant": "Water resistant",
};

function FilterControls({ products, params, onChange }: { products: Product[]; params: URLSearchParams; onChange: (key: string, value: string, checked: boolean) => void }) {
  const counts = useMemo(() => getFacetCounts(products), [products]);
  const selected = (key: string, value: string) => (params.get(key) ?? "").split(",").includes(value);
  const minValue = Math.round(Number(params.get("price")?.split("-")[0] ?? 0) / 100);
  const maxValue = Math.round(Number(params.get("price")?.split("-")[1] ?? 400000) / 100);
  const sizeOptions = ["sofas", "sectionals", "beds", "dining-tables", "desks", "rugs", "pet-beds"].filter((value) => counts.size[value]);
  const features = Object.keys(counts.feature).slice(0, 8);

  const checkboxes = (group: string, values: string[], labels?: Record<string, string>) => (
    <div className="space-y-1">{values.map((value) => <label key={value} className="flex min-h-10 cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-primary" checked={selected(group, value)} onChange={(event) => onChange(group, value, event.target.checked)} /><span className="flex-1 capitalize">{labels?.[value] ?? titleCase(value)}</span><span className="text-xs text-muted">{counts[group]?.[value] ?? 0}</span></label>)}</div>
  );

  return (
    <div className="divide-y divide-line">
      <details open className="py-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">Price <ChevronDown className="h-4 w-4" /></summary><div className="pt-3"><div className="flex items-center gap-2"><label className="sr-only" htmlFor={`min-price-${params.get("style") ?? "all"}`}>Minimum price</label><input id={`min-price-${params.get("style") ?? "all"}`} type="number" min={0} max={maxValue} className="field" value={minValue} onChange={(event) => onChange("price", `${Math.max(0, Number(event.target.value) * 100)}-${maxValue * 100}`, true)} /><span>–</span><label className="sr-only" htmlFor={`max-price-${params.get("style") ?? "all"}`}>Maximum price</label><input id={`max-price-${params.get("style") ?? "all"}`} type="number" min={minValue} max={4000} className="field" value={maxValue} onChange={(event) => onChange("price", `${minValue * 100}-${Math.min(4000, Number(event.target.value)) * 100}`, true)} /></div><div className="mt-4 space-y-3"><label className="flex items-center gap-3 text-xs text-muted">Min<input aria-label="Minimum price slider" type="range" min={0} max={4000} step={25} value={minValue} onChange={(event) => onChange("price", `${Number(event.target.value) * 100}-${maxValue * 100}`, true)} /></label><label className="flex items-center gap-3 text-xs text-muted">Max<input aria-label="Maximum price slider" type="range" min={0} max={4000} step={25} value={maxValue} onChange={(event) => onChange("price", `${minValue * 100}-${Number(event.target.value) * 100}`, true)} /></label></div></div></details>
      <details open className="py-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">Style <ChevronDown className="h-4 w-4" /></summary><div className="pt-2">{checkboxes("style", Object.keys(counts.style))}</div></details>
      <details open className="py-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">Colour <ChevronDown className="h-4 w-4" /></summary><div className="grid grid-cols-2 gap-1 pt-2">{Object.keys(counts.color).map((color) => <label key={color} className="flex min-h-10 cursor-pointer items-center gap-2 text-sm capitalize"><input type="checkbox" className="peer sr-only" checked={selected("color", color)} onChange={(event) => onChange("color", color, event.target.checked)} /><span className={`flex h-6 w-6 items-center justify-center rounded-full border border-line peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${selected("color", color) ? "ring-2 ring-primary ring-offset-2" : ""}`} style={{ backgroundColor: colorHex[color] ?? "#DDD" }}>{selected("color", color) && <Check className="h-3.5 w-3.5 text-white mix-blend-difference" />}</span><span className="truncate">{titleCase(color)}</span></label>)}</div></details>
      <details open className="py-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">Material <ChevronDown className="h-4 w-4" /></summary><div className="pt-2">{checkboxes("material", Object.keys(counts.material))}</div></details>
      <details className="py-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">Features <ChevronDown className="h-4 w-4" /></summary><div className="pt-2">{checkboxes("feature", features, featureLabels)}</div></details>
      <details className="py-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">Size / type <ChevronDown className="h-4 w-4" /></summary><div className="pt-2">{checkboxes("size", sizeOptions)}</div></details>
      <details open className="py-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">Availability &amp; rating <ChevronDown className="h-4 w-4" /></summary><div className="space-y-1 pt-2"><label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-primary" checked={params.get("availability") === "in-stock"} onChange={(event) => onChange("availability", "in-stock", event.target.checked)} />In stock only</label>{[4, 3].map((rating) => <label key={rating} className="flex min-h-10 cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-primary" checked={Number(params.get("rating")) === rating} onChange={(event) => onChange("rating", String(rating), event.target.checked)} />{rating}★ &amp; up</label>)}<label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-primary" checked={params.get("sale") === "true"} onChange={(event) => onChange("sale", "true", event.target.checked)} />On sale</label></div></details>
    </div>
  );
}

export function CatalogView({ title, description, image, products, breadcrumbs, categorySlug, query = "" }: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setQuickView } = useUI();
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<URLSearchParams>(new URLSearchParams());
  const params = useMemo(() => new URLSearchParams(query), [query]);
  const sort = (params.get("sort") ?? "featured") as SortOption;
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);
  const compact = params.get("grid") === "compact";
  const filtered = useMemo(() => applyFilters(products, params), [products, params]);
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / 24));
  const currentPage = Math.min(page, totalPages);
  const visible = sorted.slice((currentPage - 1) * 24, currentPage * 24);
  const active = activeFilterLabels(params);
  const category = categories.find((item) => item.slug === categorySlug);

  const navigate = (next: URLSearchParams, resetPage = true) => {
    if (resetPage) next.delete("page");
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const change = (key: string, value: string, checked: boolean, target = params) => {
    const next = new URLSearchParams(target.toString());
    const values = (next.get(key) ?? "").split(",").filter(Boolean);
    const updated = checked ? Array.from(new Set([...values, value])) : values.filter((item) => item !== value);
    if (updated.length) next.set(key, updated.join(",")); else next.delete(key);
    return next;
  };
  const applyFilter = (key: string, value: string, checked: boolean) => navigate(change(key, value, checked));
  const removeFilter = (key: string) => { const next = new URLSearchParams(params.toString()); next.delete(key); navigate(next); };
  const clear = () => navigate(new URLSearchParams());
  const openFilters = () => { setDraft(new URLSearchParams(params.toString())); setFilterOpen(true); };

  return (
    <div className="section pt-6 sm:pt-8">
      <div className="container-shell">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[.15em] text-accent">The collection</p><h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-muted">{description}</p></div>
          {image && <div className="relative hidden h-24 w-40 overflow-hidden rounded-md bg-surface md:block"><StoreImage src={image} alt="" sizes="160px" /></div>}
        </div>
        {category && <nav aria-label={`${category.name} categories`} className="scrollbar-hide mb-7 flex gap-2 overflow-x-auto pb-2"><Link href={`/c/${category.slug}`} className="min-h-11 shrink-0 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-primary">All {category.name}</Link>{category.children.map((child) => <Link key={child.slug} href={`/c/${category.slug}/${child.slug}`} className="min-h-11 shrink-0 rounded-full border border-line bg-white px-4 py-2 text-sm hover:border-primary hover:text-primary">{child.name}</Link>)}</nav>}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-line py-4">
          <p className="text-sm text-muted" role="status" aria-live="polite"><strong className="text-ink">{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"} found</p>
          <div className="flex items-center gap-2"><label htmlFor="sort-products" className="text-sm font-semibold">Sort:</label><select id="sort-products" className="field h-11 min-h-11 w-auto min-w-40 py-1" value={sort} onChange={(event) => { const next = new URLSearchParams(params.toString()); next.set("sort", event.target.value); navigate(next); }}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><div className="hidden items-center gap-1 sm:flex"><button type="button" className={`icon-button ${compact ? "bg-surface text-primary" : ""}`} aria-label="Comfortable grid" aria-pressed={!compact} onClick={() => { const next = new URLSearchParams(params.toString()); next.delete("grid"); navigate(next, false); }}><Grid2X2 className="h-5 w-5" /></button><button type="button" className={`icon-button ${compact ? "bg-surface text-primary" : ""}`} aria-label="Compact grid" aria-pressed={compact} onClick={() => { const next = new URLSearchParams(params.toString()); next.set("grid", "compact"); navigate(next, false); }}><Grid3X3 className="h-5 w-5" /></button></div></div>
        </div>
        {active.length > 0 && <div className="mb-5 flex flex-wrap items-center gap-2">{active.map((filter) => <button key={`${filter.key}-${filter.label}`} type="button" className="flex min-h-11 items-center gap-2 rounded-full bg-surface px-3 text-xs font-medium hover:bg-line" onClick={() => removeFilter(filter.key)}>{filter.label}<X className="h-3.5 w-3.5" /><span className="sr-only">Remove filter</span></button>)}<button type="button" className="min-h-11 text-sm font-semibold text-primary underline" onClick={clear}>Clear all</button></div>}
        <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="sticky top-40 hidden max-h-[calc(100vh-11rem)] overflow-y-auto pr-2 lg:block" aria-label="Product filters"><div className="mb-2 flex items-center justify-between"><h2 className="text-lg font-bold">Filters</h2>{hasActiveFilters(params) && <button type="button" className="min-h-11 text-sm text-primary underline" onClick={clear}>Clear all</button>}</div><FilterControls products={products} params={params} onChange={applyFilter} /></aside>
          <div>
            {visible.length ? <div className={`product-grid grid gap-4 ${compact ? "xl:grid-cols-5" : ""}`}>{visible.map((product, index) => <div key={product.id} className="contents">{index === 8 && !compact && <div className="col-span-2 hidden min-h-56 flex-col justify-center rounded-md bg-primary p-6 text-white lg:flex"><p className="text-xs font-semibold uppercase tracking-wider text-gold">Need a little help?</p><h2 className="mt-2 font-heading text-2xl font-semibold">Find your perfect fit</h2><p className="mt-2 text-sm text-white/80">Our design team can help you choose pieces that work together.</p><Button variant="secondary" className="mt-4 self-start border-white bg-transparent text-white hover:bg-white/10" onClick={() => setQuickView(products[0])}>Explore a quick view</Button></div>}<ProductCard product={product} /></div>)}</div> : <div className="rounded-lg border border-line bg-surface px-6 py-16 text-center"><SlidersHorizontal className="mx-auto h-10 w-10 text-primary" /><h2 className="mt-4 font-heading text-2xl font-semibold">No products match your filters</h2><p className="mt-2 text-muted">Try removing a filter or explore one of our popular categories.</p><Button className="mt-5" onClick={clear}>Clear filters</Button><div className="mt-5 flex flex-wrap justify-center gap-3">{categories.slice(0, 4).map((item) => <Link key={item.slug} href={`/c/${item.slug}`} className="min-h-11 py-2 text-sm font-semibold text-primary underline">{item.name}</Link>)}</div></div>}
            {totalPages > 1 && <nav aria-label="Product pages" className="mt-10 flex items-center justify-center gap-1"><button type="button" className="icon-button" disabled={currentPage === 1} aria-label="Previous page" onClick={() => { const next = new URLSearchParams(params.toString()); next.set("page", String(currentPage - 1)); navigate(next, false); }}><ArrowRight className="h-5 w-5 rotate-180" /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" className={`icon-button ${number === currentPage ? "bg-primary text-white hover:bg-primary-hover hover:text-white" : ""}`} aria-label={`Page ${number}`} aria-current={number === currentPage ? "page" : undefined} onClick={() => { const next = new URLSearchParams(params.toString()); next.set("page", String(number)); navigate(next, false); }}>{number}</button>)}<button type="button" className="icon-button" disabled={currentPage === totalPages} aria-label="Next page" onClick={() => { const next = new URLSearchParams(params.toString()); next.set("page", String(currentPage + 1)); navigate(next, false); }}><ArrowRight className="h-5 w-5" /></button></nav>}
          </div>
        </div>
      </div>
      <button type="button" className="btn btn-primary fixed inset-x-4 bottom-4 z-30 shadow-lg lg:hidden" onClick={openFilters}><SlidersHorizontal className="h-5 w-5" /> Filter &amp; sort{active.length ? ` (${active.length})` : ""}</button>
      <Overlay open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter & sort" side="bottom">
        <div className="flex-1 overflow-y-auto px-5"><label htmlFor="mobile-sort" className="label pt-4">Sort products</label><select id="mobile-sort" className="field mb-2" value={draft.get("sort") ?? "featured"} onChange={(event) => { const next = new URLSearchParams(draft.toString()); next.set("sort", event.target.value); setDraft(next); }}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><FilterControls products={products} params={draft} onChange={(key, value, checked) => setDraft(change(key, value, checked, draft))} /></div>
        <div className="flex shrink-0 gap-3 border-t border-line bg-white p-4"><Button variant="secondary" className="flex-1" onClick={() => setDraft(new URLSearchParams())}>Clear all</Button><Button className="flex-[2]" onClick={() => { navigate(draft); setFilterOpen(false); }}>Apply ({applyFilters(products, draft).length} results)</Button></div>
      </Overlay>
    </div>
  );
}
