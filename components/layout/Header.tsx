"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Heart, HelpCircle, MapPin, Menu, Package, Search, ShoppingBag, User, X } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { StoreImage } from "@/components/ui/StoreImage";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { useWishlist } from "@/context/WishlistContext";
import { useDebounce } from "@/hooks/useDebounce";
import { categories, colorHex, products, styles } from "@/lib/catalog";
import { searchCategories, searchProducts } from "@/lib/search";

const messages = [
  "Free delivery on orders over $999",
  "Special financing available — learn more",
  "New season styles are here",
];

const brandLinks = [
  { label: "Our Story", href: "/pages/about" },
  { label: "Room Inspiration", href: "/#inspiration" },
  { label: "Design Approach", href: "/pages/design-services" },
  { label: "Journal", href: "/#journal" },
  { label: "Contact", href: "/pages/contact" },
];

function AnnouncementBar({ informational = false }: { informational?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Read the session preference after hydration to keep server and client markup aligned.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(sessionStorage.getItem("ho-announce-dismissed") !== "1");
  }, []);

  useEffect(() => {
    if (informational || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % messages.length), 5000);
    return () => window.clearInterval(timer);
  }, [informational, paused]);

  if (!visible) return null;

  return (
    <div className="relative flex min-h-10 items-center justify-center bg-primary px-12 py-2 text-center text-xs font-medium text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <p aria-live={informational ? "off" : "polite"}>
        {informational
          ? "Original rooms, materials and ideas for thoughtful living"
          : index === 1
            ? <Link href="/pages/financing" className="underline underline-offset-2">{messages[index]}</Link>
            : messages[index]}
      </p>
      <button type="button" className="icon-button absolute right-1 top-1/2 min-h-9 min-w-9 -translate-y-1/2 text-white hover:bg-white/10" aria-label="Dismiss announcement" onClick={() => { sessionStorage.setItem("ho-announce-dismissed", "1"); setVisible(false); }}><X className="h-4 w-4" /></button>
    </div>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`inline-flex min-h-11 shrink-0 items-center gap-2 ${light ? "text-footer-text" : "text-primary"}`} aria-label="Haven and Oak home">
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M24 40V19M24 28C11 29 7 19 8 10c11-1 19 6 16 18Zm0-4c0-11 7-17 18-15 1 10-5 17-18 15Z" /></svg>
      <span className="font-heading text-[22px] font-bold tracking-tight sm:text-2xl">Haven <span className="font-normal italic">&amp;</span> Oak</span>
    </Link>
  );
}

type Suggestion = { key: string; label: string; href: string; image?: string; detail?: string };

function SearchBox({ mobile = false, onNavigate, idPrefix }: { mobile?: boolean; onNavigate?: () => void; idPrefix?: string }) {
  const router = useRouter();
  const prefix = idPrefix ?? (mobile ? "mobile" : "site");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(query);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo<Suggestion[]>(() => {
    if (!debounced.trim()) return [];
    return [
      ...searchProducts(products, debounced).slice(0, 6).map((product) => ({ key: product.id, label: product.title, href: `/p/${product.slug}`, image: product.images[0]?.src, detail: "Product" })),
      ...searchCategories(categories, debounced).slice(0, 4).map((category) => ({ key: category.slug, label: category.name, href: `/c/${category.slug}`, detail: "Category" })),
    ];
  }, [debounced]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || !open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setOpen(false);
    };
    input.addEventListener("keydown", closeOnEscape);
    return () => input.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    setActive(-1);
    onNavigate?.();
    router.push(href);
  };

  return (
    <div ref={wrapperRef} className={`relative ${mobile ? "w-full" : "hidden w-full max-w-xl md:block"}`}>
      <form role="search" onSubmit={(event) => { event.preventDefault(); if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`); }}>
        <label htmlFor={prefix} className="sr-only">Search furniture</label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          id={prefix}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={`${prefix}-suggestions`}
          aria-activedescendant={active >= 0 ? `${prefix}-suggestion-${active}` : undefined}
          autoComplete="off"
          className="field h-12 rounded-sm bg-surface pl-11 pr-10"
          placeholder="Search furniture, rooms, styles…"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, suggestions.length - 1)); }
            if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, -1)); }
            if (event.key === "Enter" && active >= 0 && suggestions[active]) { event.preventDefault(); go(suggestions[active].href); }
          }}
        />
      </form>
      {open && suggestions.length > 0 && (
        <div id={`${prefix}-suggestions`} role="listbox" className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-md border border-line bg-white py-2 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              id={`${prefix}-suggestion-${index}`}
              key={suggestion.key}
              type="button"
              role="option"
              aria-selected={index === active}
              className={`flex min-h-14 w-full items-center gap-3 px-3 text-left hover:bg-surface ${index === active ? "bg-surface" : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => go(suggestion.href)}
            >
              {suggestion.image ? <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-sm bg-surface"><StoreImage src={suggestion.image} alt="" sizes="56px" /></span> : <Search className="ml-3 h-5 w-5 shrink-0 text-primary" />}
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{suggestion.label}</span><span className="block text-xs text-muted">{suggestion.detail}</span></span>
            </button>
          ))}
          <button type="button" className="min-h-11 w-full border-t border-line px-4 py-2 text-left text-sm font-semibold text-primary" onMouseDown={(event) => event.preventDefault()} onClick={() => go(`/search?q=${encodeURIComponent(query)}`)}>See all results for “{query}”</button>
        </div>
      )}
    </div>
  );
}

type NavGroup = { id: string; label: string; href?: string; children?: { label: string; href: string }[]; image?: string; accent?: boolean };

function MobileMenu({ open, onClose, informational = false }: { open: boolean; onClose: () => void; informational?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { count } = useCart();
  const { ids } = useWishlist();

  if (informational) {
    return (
      <Overlay open={open} onClose={onClose} title="Menu" side="left" className="overflow-y-auto">
        <nav aria-label="Mobile navigation" className="flex-1 p-4">
          {brandLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className="flex min-h-14 items-center border-b border-line font-semibold hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Link href="/c/living-room" onClick={onClose} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">
            Browse the separate catalogue
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-muted">Haven &amp; Oak is an original furniture and interior-inspiration concept. This homepage presents brand stories and room ideas, not products for sale.</p>
        </nav>
      </Overlay>
    );
  }

  return (
    <Overlay open={open} onClose={onClose} title="Menu" side="left" className="overflow-y-auto">
      <div className="border-b border-line p-4"><SearchBox mobile idPrefix="menu-search" onNavigate={onClose} /></div>
      <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-4">
        {categories.map((category) => (
          <details key={category.slug} className="border-b border-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-semibold"><Link href={`/c/${category.slug}`} onClick={onClose}>{category.name}</Link><ChevronDown className="h-5 w-5" aria-hidden="true" /></summary>
            <div className="pb-3 pl-3">{category.children.map((child) => <Link key={child.slug} href={`/c/${category.slug}/${child.slug}`} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted">{child.name}</Link>)}</div>
          </details>
        ))}
        <div className="mt-4 grid gap-1 text-sm font-medium">
          <Link href="/collections/deals" onClick={onClose} className="min-h-11 py-3 text-accent">Deals</Link>
          <Link href="/style/modern" onClick={onClose} className="min-h-11 py-3">Shop by Style</Link>
          <Link href="/pages/financing" onClick={onClose} className="min-h-11 py-3">Financing</Link>
          <Link href="/wishlist" onClick={onClose} className="min-h-11 py-3">Wishlist ({ids.length})</Link>
          <Link href="/cart" onClick={onClose} className="min-h-11 py-3">Cart ({count})</Link>
          <Link href="/pages/track-order" onClick={onClose} className="min-h-11 py-3">Track Order</Link>
          <Link href="/pages/faq" onClick={onClose} className="min-h-11 py-3">Help &amp; FAQ</Link>
        </div>
      </nav>
      <form className="border-t border-line p-4" onSubmit={(event) => { event.preventDefault(); if (query.trim()) { onClose(); router.push(`/search?q=${encodeURIComponent(query)}`); } }}>
        <label htmlFor="mobile-menu-search" className="sr-only">Search all products</label>
        <input id="mobile-menu-search" className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quick search" />
      </form>
    </Overlay>
  );
}

export function Header() {
  const pathname = usePathname();
  const informational = pathname === "/";
  const { count, openDrawer, storageWarning } = useCart();
  const { ids } = useWishlist();
  const { toast } = useUI();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const groups = useMemo<NavGroup[]>(() => [
    ...categories.slice(0, 7).map((category) => ({
      id: category.slug,
      label: category.name,
      href: `/c/${category.slug}`,
      children: category.children.map((child) => ({ label: child.name, href: `/c/${category.slug}/${child.slug}` })),
      image: category.image,
    })),
    { id: "deals", label: "Deals", href: "/collections/deals", accent: true },
    { id: "style", label: "Style", children: styles.map((style) => ({ label: style.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("-"), href: `/style/${style}` })), image: "/images/photos/rooms/living-room.webp" },
    { id: "financing", label: "Financing", href: "/pages/financing" },
  ], []);

  const group = groups.find((item) => item.id === activeGroup);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transient navigation closes whenever the route changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActiveGroup(null); setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const outside = (event: MouseEvent) => { if (!headerRef.current?.contains(event.target as Node)) setActiveGroup(null); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setActiveGroup(null); };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", escape); };
  }, []);

  const openGroup = (id: string) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setActiveGroup(id);
  };
  const scheduleClose = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActiveGroup(null), 180);
  };

  return (
    <header ref={headerRef} className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
      <AnnouncementBar informational={informational} />
      {!informational && storageWarning && <div role="status" className="bg-warning-bg px-4 py-2 text-center text-xs text-warning-text">Browser storage is unavailable. Your cart will work for this visit but may not be saved.</div>}
      {informational ? (
        <div className="hidden bg-surface lg:block">
          <div className="container-shell flex h-9 items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-5">
              <Link href="/pages/about" className="flex min-h-9 items-center hover:text-primary">Our Story</Link>
              <Link href="/#inspiration" className="flex min-h-9 items-center hover:text-primary">Room Inspiration</Link>
              <Link href="/#journal" className="flex min-h-9 items-center hover:text-primary">Journal</Link>
            </div>
            <Link href="/pages/contact" className="min-h-9 py-2 hover:text-primary">Contact</Link>
          </div>
        </div>
      ) : (
        <div className="hidden bg-surface lg:block">
          <div className="container-shell flex h-9 items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-5">
              <Link href="/pages/stores" className="flex min-h-9 items-center gap-1 hover:text-primary"><MapPin className="h-3.5 w-3.5" /> Find a Store</Link>
              <Link href="/pages/track-order" className="flex min-h-9 items-center gap-1 hover:text-primary"><Package className="h-3.5 w-3.5" /> Track Order</Link>
              <Link href="/pages/faq" className="flex min-h-9 items-center gap-1 hover:text-primary"><HelpCircle className="h-3.5 w-3.5" /> Help &amp; FAQ</Link>
            </div>
            <div className="flex items-center gap-5"><Link href="/pages/design-services" className="min-h-9 py-2 hover:text-primary">Design Services</Link><button type="button" className="min-h-9 py-2 hover:text-primary" onClick={() => setSignInOpen(true)}>Sign In</button></div>
          </div>
        </div>
      )}
      <div className={`container-shell flex items-center gap-2 transition-[height] duration-200 ${scrolled ? "h-16" : "h-[72px]"}`}>
        <button type="button" className="icon-button lg:hidden" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu className="h-6 w-6" /></button>
        <Logo />
        {!informational && <div className="ml-auto hidden flex-1 justify-center px-6 md:flex"><SearchBox /></div>}
        {informational ? (
          <Link href="/pages/contact" className="ml-auto hidden min-h-11 items-center px-3 text-sm font-semibold text-primary hover:underline sm:inline-flex">Get in touch</Link>
        ) : (
          <div className="ml-auto flex items-center gap-0 md:ml-0">
            <Link href="/wishlist" className="icon-button relative" aria-label={`Wishlist, ${ids.length} ${ids.length === 1 ? "item" : "items"}`}><Heart className="h-5 w-5" />{ids.length > 0 && <span className="absolute right-0 top-0 min-w-4 rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-white">{ids.length}</span>}</Link>
            <button type="button" className="icon-button hidden sm:inline-flex" aria-label="Account information" onClick={() => setSignInOpen(true)}><User className="h-5 w-5" /></button>
            <button type="button" className="icon-button relative" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`} onClick={openDrawer}><ShoppingBag className="h-5 w-5" />{count > 0 && <span key={count} className="badge-pulse absolute right-0 top-0 min-w-4 rounded-full bg-accent px-1 text-[10px] font-bold leading-4 text-white">{count > 9 ? "9+" : count}</span>}</button>
          </div>
        )}
      </div>
      {!informational && <div className="border-t border-line md:hidden"><div className="container-shell py-2"><SearchBox mobile /></div></div>}
      {informational ? (
        <nav aria-label="Main navigation" className="hidden border-t border-line lg:block">
          <div className="container-shell flex h-11 items-center justify-center gap-8">
            {brandLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex min-h-11 items-center text-[13px] font-semibold hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : (
        <nav aria-label="Main navigation" className="relative hidden border-t border-line lg:block" onMouseLeave={scheduleClose}>
          <div className="container-shell flex h-11 items-center justify-between gap-1">
            {groups.map((item) => (
              <div key={item.id} onMouseEnter={() => item.children && openGroup(item.id)}>
                {item.href ? (
                  <Link href={item.href} className={`flex min-h-11 items-center gap-1 rounded-sm px-2.5 text-[13px] font-semibold hover:bg-surface xl:px-3 ${item.accent ? "text-accent" : "text-ink"}`} onFocus={() => setActiveGroup(null)} onMouseEnter={() => setActiveGroup(null)}>{item.label}{item.children && <ChevronDown className="h-3.5 w-3.5" />}</Link>
                ) : (
                  <button type="button" className="flex min-h-11 items-center gap-1 rounded-sm px-2.5 text-[13px] font-semibold hover:bg-surface xl:px-3" aria-expanded={activeGroup === item.id} aria-controls="mega-menu" onClick={() => setActiveGroup(activeGroup === item.id ? null : item.id)} onFocus={() => openGroup(item.id)}>{item.label}<ChevronDown className="h-3.5 w-3.5" /></button>
                )}
              </div>
            ))}
          </div>
          {group && (
            <div id="mega-menu" className="absolute inset-x-0 top-full border-y border-line bg-white shadow-lg" onMouseEnter={() => openGroup(group.id)}>
              <div className="container-shell grid gap-8 py-8 md:grid-cols-4">
                <div><h2 className="mb-3 text-sm font-bold">{group.label}</h2><ul className="space-y-1">{(group.children ?? []).map((child) => <li key={child.href}><Link href={child.href} className="flex min-h-9 items-center text-sm text-muted hover:text-primary hover:underline">{child.label}</Link></li>)}</ul></div>
                <div><h2 className="mb-3 text-sm font-bold">Shop by Style</h2><ul className="space-y-1">{styles.slice(0, 7).map((style) => <li key={style}><Link href={`/style/${style}`} className="flex min-h-9 items-center text-sm capitalize text-muted hover:text-primary hover:underline">{style}</Link></li>)}</ul></div>
                <div><h2 className="mb-3 text-sm font-bold">Shop by Colour</h2><div className="grid grid-cols-2 gap-2">{Object.entries(colorHex).slice(0, 8).map(([color, hex]) => <Link key={color} href={`/color/${color}`} className="flex min-h-9 items-center gap-2 text-sm capitalize text-muted hover:text-primary"><span className="h-5 w-5 rounded-full border border-line" style={{ backgroundColor: hex }} aria-hidden="true" />{color}</Link>)}</div></div>
                <Link href={group.href ?? `/style/${group.id}`} className="group relative min-h-52 overflow-hidden rounded-md bg-surface"><StoreImage src={group.image ?? "/images/photos/rooms/living-room.webp"} alt="" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-footer/90 to-transparent p-5 pt-14 text-white"><span className="block text-xs uppercase tracking-wider">Make it yours</span><span className="font-heading text-xl font-semibold">Explore {group.label}</span></span></Link>
              </div>
            </div>
          )}
        </nav>
      )}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} informational={informational} />
      <Overlay open={signInOpen} onClose={() => setSignInOpen(false)} title="Account demo">
        <div className="p-6"><p className="text-muted">Accounts are not part of this frontend demo. You can still browse, save favourites and complete a mock checkout without signing in.</p><button type="button" className="btn btn-primary mt-6" onClick={() => { setSignInOpen(false); toast("You’re browsing as a demo guest."); }}>Continue as guest</button></div>
      </Overlay>
    </header>
  );
}
