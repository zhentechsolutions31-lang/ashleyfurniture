# 06 – Layout: Header, Mega Menu, Footer

## 1. Announcement bar
- Height 40 px, bg `primary`, white text, centred, 14 px.
- Rotating messages (every 5 s, pause on hover/focus): "Free delivery on orders over $999", "Special financing available", "New spring styles are here".
- Dismiss button (×) saves `ho-announce-dismissed` in `sessionStorage`.
- Respect `prefers-reduced-motion` (no auto-rotate).

## 2. Utility bar (desktop only)
- Left: "Find a Store", "Track Order", "Help & FAQ".
- Right: "Design Services", "Sign In" (non-functional placeholder, opens a modal explaining demo).
- bg `surface`, 13 px text, height 36 px.

## 3. Main header (sticky)
```
[☰ mobile] [Logo]  [ ———— Search box ———— ]  [♡ Wishlist] [👤] [🛒 Cart (n)]
```
- Height 72 px desktop / 60 px mobile; white bg; bottom border `line`; shadow-sm after scroll > 8 px.
- **Logo:** text/SVG wordmark "Haven & Oak" in Playfair Display, primary colour.
- **Search:** 48 px height, rounded 6, search icon; typing shows **autosuggest dropdown** (max 6 products + 4 categories) using `lib/search.ts`; Enter goes to `/search?q=`. Keyboard: ↑ ↓ Enter Esc. ARIA combobox pattern.
- **Cart button:** icon + count badge (accent bg). Click opens CartDrawer. Badge animates (scale pulse) on add. `aria-label="Cart, 3 items"`.
- **Wishlist:** heart icon with count.

## 4. Category navigation bar
Items: **Living Room · Bedroom · Dining · Office · Outdoor · Mattresses · Rugs & Decor · Storage · Deals · Style · Financing**
- Deals in accent colour.
- Each item with children opens a **mega menu** on hover (150 ms delay) or click/Enter.

### Mega menu layout (desktop)
- Full-width panel under nav, white, shadow-lg.
- 4 columns: link lists (e.g. Sofas, Sectionals, Recliners, Loveseats, Chairs, Ottomans), "Shop by Style", "Shop by Colour", and a promo image tile with CTA.
- Close on Esc, outside click, or route change.
- Data from `src/data/navigation.json`.

### Mobile menu
- Hamburger opens left drawer (85 % width).
- Accordion for each top category; search at top; links for Wishlist, Track Order, Help.
- Focus trap, close on Esc, scroll lock on body.

## 5. Footer
- bg `footer`, text `footer-text`, link hover white + underline.
- **Row 1 (4 columns):**
  1. Customer Care – Contact, FAQ, Shipping, Returns, Track Order
  2. Shop – Living Room, Bedroom, Dining, Office, Outdoor, Mattresses
  3. Company – About, Careers, Press, Design Services
  4. Stay Connected – short newsletter form + social icons
- **Row 2:** payment icons (Visa, Mastercard, Amex, PayPal as simple SVGs), "Secure checkout".
- **Row 3:** © year Haven & Oak · Privacy · Terms · Accessibility · Sitemap
- Mobile: columns collapse into accordions.

## 6. Services strip (above footer)
4 items with icons: **Fast Delivery**, **Assembly Help**, **Easy Returns**, **Customer Support**. bg `surface`, icons in primary.
