# 05 – Pages and Routing

Use `BrowserRouter` (needs SPA fallback on host, see docs/20) or `HashRouter` if the host cannot rewrite.

| Route | Page | Notes |
|---|---|---|
| `/` | HomePage | See docs/07 |
| `/c/:categorySlug` | CategoryPage | e.g. `/c/sofas`, supports query params |
| `/c/:categorySlug/:subSlug` | CategoryPage | Sub-category |
| `/collections/:slug` | CategoryPage | Deals, Digital Deals, Designer Picks, Spring Refresh |
| `/style/:styleSlug` | CategoryPage | Modern, Farmhouse, Coastal, etc. |
| `/color/:colorSlug` | CategoryPage | Gray, Tan, White, etc. |
| `/p/:productSlug` | ProductPage | Slug includes SKU, e.g. `harlow-power-sofa-HO1042` |
| `/search?q=` | SearchPage | Client-side search |
| `/wishlist` | WishlistPage | From localStorage |
| `/cart` | CartPage | Full cart |
| `/checkout` | CheckoutPage | Mock form |
| `/order/:orderId` | OrderConfirmationPage | Reads saved order |
| `/pages/:slug` | StaticPage | about, contact, faq, shipping, returns, privacy, terms |
| `*` | NotFoundPage | Friendly 404 with search + popular categories |

## Query parameters on listing pages
`?sort=` (`featured|price-asc|price-desc|newest|rating`), `?page=`, `?price=min-max`, `?style=a,b`, `?color=a,b`, `?material=a,b`, `?availability=in-stock`, `?rating=4`.
- Keep filters in the URL so pages are shareable and back/forward works.

## Behaviour rules
- Scroll to top on route change (except when only query params change).
- Move focus to the page `<h1>` after navigation (accessibility).
- Lazy-load pages with `React.lazy` + `Suspense` (skeleton fallback).
- Unknown product or category slug → NotFoundPage with `noindex`.
