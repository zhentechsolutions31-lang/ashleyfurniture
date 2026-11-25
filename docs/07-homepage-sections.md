# 07 – Homepage Sections (top to bottom)

Each section is its own component in `components/home/`. Use `<section aria-labelledby>` with an `<h2>`.

## 1. Hero banner
- Full-width image (aspect 21:9 desktop, 4:5 mobile), overlay gradient left → transparent.
- Left-aligned text block: eyebrow, H1 (Playfair), supporting sentence, two buttons (primary "Shop Living Room", secondary "View Deals").
- Optional 3-slide carousel (Embla), autoplay 6 s, pause on hover, dots + prev/next, disabled autoplay for reduced motion.
- First slide image: `fetchpriority="high"`, no lazy load (LCP).

## 2. Promo tiles row
3 equal tiles: "Deals of the Week", "New Arrivals", "Designer Picks". Image + title + "Shop now →".

## 3. Shop by Category
- Horizontal grid of 8–10 circular/rounded images with labels: Sofas, Sectionals, Recliners, Beds, Dressers, Dining Sets, Desks, Outdoor, Mattresses, Rugs.
- Mobile: horizontal scroll with snap.

## 4. Featured products carousel – "Best Sellers"
- 4 cards visible desktop, 2 tablet, 1.3 mobile (peek).
- Uses `ProductCard`. Arrows + swipe.

## 5. Financing banner
- Wide strip, bg `surface` with primary border-left.
- Text: "Special financing available. Pay over time with low monthly payments." + "Learn more" button opening a Modal with demo terms.
- Add small print: "Demo only. Subject to approval." (non-functional).

## 6. Shop by Room
Mosaic grid (1 large + 4 small) with images: Living Room, Bedroom, Dining Room, Home Office, Outdoor. Hover zoom (scale 1.04).

## 7. Deals carousel – "This Week's Deals"
Products with sale prices (original struck through, sale in accent, "Save $X" chip) + countdown optional (client-side to next Sunday midnight).

## 8. Shop by Style
Tabs/chips: Modern · Contemporary · Traditional · Transitional · Farmhouse · Coastal · Mid-Century. Selecting a style swaps a 4-product row below and shows "View all {style}" link.

## 9. Design inspiration / Lookbook
2 large editorial images with hotspots (pins). Clicking a pin shows a small product popover with Add to Cart.

## 10. Reviews / trust strip
3 testimonial cards with stars (static, original copy) + overall rating summary.

## 11. Services strip
See docs/06.

## 12. Newsletter
- bg primary, white text. Email input + "Subscribe" button.
- Validates format; on success shows inline success message and saves `ho-newsletter` flag in localStorage. **No network request.**

## Section spacing
80 px between sections desktop, 48 px mobile. Alternate white / surface backgrounds.
