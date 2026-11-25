# 19 – Testing and QA Checklist

## Automated
- **Vitest unit tests:** `lib/cart.ts` totals, reducer actions, `lib/filters.ts`, `lib/money.ts`, `lib/search.ts`, storage fallback.
- **Testing Library:** AddToCartButton adds item and opens drawer; quantity stepper clamps; PromoCodeForm errors; filter sidebar updates URL.
- **Playwright (optional) e2e:**
  1. Home → category → product → Add to Cart → drawer shows item
  2. Reload page → cart persists
  3. Open second tab → cart syncs
  4. Change quantity, remove, undo
  5. Apply `WELCOME10` → totals update
  6. Checkout → order confirmation → cart empty
- **axe-core** automated accessibility scan on each page.
- **Lighthouse CI** thresholds from docs/01.

## Manual – Add to Cart
- [ ] Add from product card, quick view, PDP, carousel
- [ ] Same item twice increases quantity
- [ ] Different variants create separate lines
- [ ] Max quantity (10) enforced with message
- [ ] Badge count correct and announced
- [ ] Cart survives refresh, browser restart, and private-mode fallback works
- [ ] Corrupt `ho-cart-v1` value doesn't crash the app
- [ ] Sold-out item cannot be added
- [ ] Prices display with 2 decimals and thousands separators

## Manual – UI
- [ ] Header sticky, mega menu keyboard accessible
- [ ] Mobile menu, filters sheet, and cart drawer trap focus
- [ ] Filters update URL; back button restores state
- [ ] Sort works for each option
- [ ] Search suggestions and results page
- [ ] Wishlist add/remove persists
- [ ] 404 page works
- [ ] Print stylesheet for order confirmation

## Cross-browser/device
Chrome, Edge, Firefox, Safari (macOS + iOS), Android Chrome. Widths 320–1920.

## Release gate
All unit tests green, no console errors, Lighthouse targets met, axe: 0 serious/critical issues.
