# Haven & Oak Furniture Storefront

A complete frontend-only furniture e-commerce demo built with Next.js, React, TypeScript, and Tailwind CSS. It includes a 72-product catalog, responsive category and collection pages, product galleries, search, filters, a persistent cart and wishlist, mock checkout, order confirmation, and original informational pages.

> This is a portfolio demo. It is not affiliated with a retailer, processes no real orders, offers no real financing, and must never be used to collect real payment details.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer
- A modern browser with JavaScript enabled

## Getting started

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run catalog:generate` | Regenerate catalog JSON and verify photo references |
| `npm run photos:source` | Download licensed photo candidates into the ignored source cache |
| `npm run photos:process` | Crop, resize, and encode the curated photo set |

The final optimized photographs are already included in `public/images/photos`; normal development does not require running the photo scripts.

## Main routes

| Route | Description |
|---|---|
| `/` | Editorial brand homepage with room photography, design principles, inspiration, and no shoppable product modules |
| `/c/[category]` | Category listing with filters, sorting, and pagination |
| `/c/[category]/[subcategory]` | Subcategory listing |
| `/collections/[slug]` | Curated collection listing |
| `/style/[slug]` | Style-based listing |
| `/color/[slug]` | Colour-based listing |
| `/p/[slug]` | Product detail, gallery, variants, delivery estimate, and reviews |
| `/search` | Product and category search |
| `/cart` | Full cart with quantities, promo codes, and totals |
| `/checkout` | Mock checkout with validation and no card fields |
| `/order/[orderId]` | Locally generated demo order confirmation |
| `/wishlist` | Persistent wishlist |
| `/pages/[slug]` | Static information, policy, and contact pages |
| `/sitemap.xml` | Generated sitemap for indexed deployments; empty while demo mode is enabled |
| `/robots.txt` | Generated crawler directives |

The homepage introduces Haven & Oak as an informational furniture and interior-inspiration concept. Products, cart controls and collection promotions are intentionally kept on separate catalogue and shopping routes.

## Browser-only data

Cart, wishlist, recently viewed products, newsletter preferences, reviews, notification interest, and demo orders are stored in the current browser. No database or application backend is used. Storage events synchronize cart and wishlist changes between open tabs.

Use **Clear my demo data** in the footer to remove locally saved demo state.

## Catalog data

The deterministic generator lives in `scripts/generate-products.mjs`. Generated data is stored in `src/data`:

- `products.json` — 72 products with variants, pricing, ratings, features, and photo galleries
- `categories.json` — nine top-level categories and their subcategories
- `navigation.json` — header and footer navigation content
- `promos.json` — collections and promotional modules

Prices are stored as integer cents. Cart totals and discounts use integer arithmetic before formatting.

## Photography and attribution

All storefront photography is licensed stock from Unsplash and Pexels, downloaded and self-hosted locally. No retailer photographs, logos, product descriptions, or code are used. Haven & Oak branding and catalog copy are original to this project.

- Final assets: `public/images/photos`
- Source and license manifest: `public/images/photos/credits.json`
- Human-readable credits are linked from the footer
- Unsplash license: <https://unsplash.com/license>
- Pexels license: <https://www.pexels.com/license>

The source cache under `scripts/.photo-cache` is ignored by Git. Photo mappings are curated in `scripts/photo-map.json`; changing a mapping requires reprocessing assets and regenerating the catalog.

## Testing and verification

```bash
npm run typecheck
npm run lint
npm test
npm audit --audit-level=moderate
npm run build
```

The test suite covers catalog filtering, sorting, facet labels, search, cart operations, totals, promo codes, hydration, and persistence helpers. Browser QA should additionally cover keyboard navigation, dialogs, mobile layouts, storage synchronization, and the complete mock checkout flow.

## Deployment

This project uses Node server rendering for arbitrary demo order URLs, so static export is intentionally disabled.

1. Optionally set `NEXT_PUBLIC_SITE_URL` to the deployed origin, such as `https://example.com`, for accurate metadata and canonical links. The demo builds without it using `http://localhost:3000`.
2. Run `npm ci` on the host.
3. Run `npm run build`.
4. Start the server with `npm start`.
5. Configure the host to listen on its assigned `PORT`.

Keep the demo disclaimer and `noindex` behavior intact when publishing. Do not add real payment fields, backend order processing, or customer data collection without a separate security and compliance review.
