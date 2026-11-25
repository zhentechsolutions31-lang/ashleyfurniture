# 22 – Build Roadmap

Run `npm run build` and `npm run lint` at the end of every phase.

## Phase 0 – Setup
- `npm create vite@latest haven-oak -- --template react-ts`
- Install: `react-router-dom`, `tailwindcss@3 postcss autoprefixer`, `lucide-react`, `embla-carousel-react`, `react-helmet-async`, `@fontsource/inter`, `@fontsource/playfair-display`, dev: `vitest @testing-library/react @testing-library/jest-dom eslint prettier`.
- Configure Tailwind + tokens (docs/03), folder structure (docs/04).

## Phase 1 – Data and utilities
- Types, `money.ts`, `storage.ts`, `filters.ts`, `search.ts`.
- Generate `products.json`, `categories.json`, `navigation.json`, placeholders (docs/13, 14).

## Phase 2 – Layout shell
- Announcement bar, utility bar, header, search, mega menu, mobile menu, footer, services strip, skip link, routes with lazy loading.

## Phase 3 – Core UI components
- Button, Input, Modal, Drawer, Toast, Breadcrumbs, Rating, Accordion, Skeleton, Badge, PriceBlock, ProductCard.

## Phase 4 – Cart (priority)
- CartContext + reducer + persistence + cross-tab sync (docs/10).
- AddToCartButton, QuantityStepper, CartDrawer, CartLineItem, header badge, CartPage, promo codes (docs/11).
- Write and pass all cart unit tests.

## Phase 5 – Homepage
- All sections from docs/07.

## Phase 6 – Listing pages
- Filters, sort, pagination, URL sync, mobile filter sheet (docs/08).

## Phase 7 – Product detail page
- Gallery, variants, tabs, related, recently viewed, sticky mobile bar (docs/09).

## Phase 8 – Wishlist, search, static pages, 404

## Phase 9 – Checkout mock and order confirmation (docs/12)

## Phase 10 – Accessibility, SEO, performance
- docs/15, docs/16, docs/17 audits; fix all findings.
- Pre-render routes, JSON-LD, sitemap, robots.

## Phase 11 – QA and deploy
- Full checklist (docs/19), deploy (docs/20), write final README.

## Definition of done
- All pages implemented, Add to Cart fully functional offline, Lighthouse targets met, no console errors, docs/19 checklist complete.
