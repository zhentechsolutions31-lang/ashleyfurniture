# 01 – Project Overview

## Goal
A fast, professional, responsive furniture storefront that looks and behaves like a major furniture retailer, running entirely in the browser.

## In scope
- Full storefront UI (home, listing, product, cart, checkout mock, wishlist, search, static pages)
- Working cart using `localStorage` (no backend)
- Local JSON product catalogue
- Google-friendly SEO and accessibility
- Static deployment (Vercel / Netlify / GitHub Pages / Cloudflare Pages)

## Out of scope
- Real payments, user accounts, real inventory, order fulfilment, admin panel
- Any server, database or paid API

## Tech stack
| Area | Choice | Why |
|---|---|---|
| Framework | React 18 + Vite | Fast dev + small build |
| Language | TypeScript | Safer refactors |
| Routing | React Router v6 | Client-side routes |
| Styling | Tailwind CSS v3 + CSS variables | Token-driven theme |
| State | React Context + `useReducer` | No extra deps |
| Persistence | `localStorage` | No backend |
| Icons | `lucide-react` | Light, consistent |
| Carousel | `embla-carousel-react` | Accessible, small |
| Head/SEO | `react-helmet-async` | Per-page meta |
| Tests | Vitest + Testing Library + Playwright (optional) | Cart reliability |

## Alternative (no build tools)
Plain HTML + CSS + vanilla JS with ES modules is possible. Keep the same tokens, data JSON and cart logic from `docs/10`. React is recommended for maintainability.

## Constraints
- Works offline after first load (optional PWA)
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- Support last 2 versions of Chrome, Edge, Safari, Firefox; iOS Safari 15+
