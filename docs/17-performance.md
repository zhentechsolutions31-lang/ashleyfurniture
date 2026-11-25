# 17 – Performance

## Budgets
| Item | Budget |
|---|---|
| JS (initial, gzip) | ≤ 170 KB |
| CSS (gzip) | ≤ 40 KB |
| Hero image | ≤ 250 KB |
| Product image | ≤ 120 KB |
| LCP | ≤ 2.5 s on mid-range mobile, 4G |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |

## Techniques
- Route-level code splitting (`React.lazy`).
- `products.json` is large: split into `products-index.json` (listing fields only) and per-product `products/{slug}.json` loaded on the PDP; or lazy `import()` the full file on first need.
- Self-host fonts, subset Latin, `font-display: swap`, preload the 2 most-used font files.
- Images: AVIF/WebP, responsive `srcset`, explicit dimensions, lazy-load below the fold, `fetchpriority="high"` on LCP image.
- Preconnect only if a third-party origin is truly used (avoid third parties).
- Tailwind purge (default in build); avoid large icon sets (import icons individually).
- Memoise heavy filter/sort computations; virtualise only if > 500 items rendered.
- Debounce search input 200 ms.
- Avoid layout shift: reserve space for images, skeletons for carousels, fixed header heights.
- Cache: hashed asset filenames (Vite default) + long cache headers on host.
- Optional PWA (service worker via `vite-plugin-pwa`) for offline browsing; do not cache cart in the SW.

## Measure
Lighthouse CI on every phase, WebPageTest for key pages, `web-vitals` library logged to console in dev.
