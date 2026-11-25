# 09 – Product Detail Page (PDP)

## Layout (desktop)
```
Breadcrumbs
┌───────────────────────────┬────────────────────────────┐
│ Gallery (60%)             │ Badges                     │
│  - main image (zoom)      │ H1 title                   │
│  - thumbnails (vertical)  │ SKU · ★★★★☆ (128 reviews)  │
│                           │ Price block                │
│                           │ Financing note             │
│                           │ Variant selectors          │
│                           │ Quantity stepper           │
│                           │ [Add to Cart] [♡]          │
│                           │ Delivery / pickup info     │
│                           │ Key features (bullets)     │
└───────────────────────────┴────────────────────────────┘
Tabs/accordion: Description · Dimensions · Materials & Care · Shipping & Returns · Reviews
Related products carousel · Recently viewed carousel
Sticky mobile bar: price + Add to Cart
```

## Gallery
- 4–8 images, thumbnails, keyboard arrows, swipe on mobile.
- Hover zoom on desktop (CSS transform on pointer move); click opens lightbox Modal.
- `alt` text per image describing the view ("Harlow sofa in gray, front view").

## Price block
- Single price, range, or sale with original + "You save $X (Y%)".
- Per-piece note when relevant ("$440.00 each").
- Price updates when a variant is chosen.

## Variants
- Colour swatches (with label and `aria-label`), size/configuration dropdown (e.g. "3 pieces", "5 pieces").
- Out-of-stock variants shown disabled with "Sold out".
- Selected variant stored in the cart line.

## Add to Cart behaviour
1. Validate that all required variants are selected; otherwise show inline error ("Please choose a colour") and focus first missing group.
2. Dispatch `ADD_ITEM` with `{ productId, variantId, qty }`.
3. Button shows loading state ~400 ms then "Added ✓" for 1.5 s.
4. Open the CartDrawer and announce via `aria-live="polite"`: "Harlow sofa added to cart."
5. Header badge pulses.

## Info blocks
- **Delivery estimate:** computed client-side (today + 5–10 business days) with ZIP input (validates 5 digits; purely demo).
- **Assembly info:** from product data (`assembly: "Assembly required, 35 minutes"`).
- **Included pieces:** list for sectionals.

## Tabs content
- Description (original copy)
- Dimensions table (W × D × H, seat height, weight)
- Materials & Care
- Shipping & Returns (static)
- Reviews: static sample reviews from JSON, rating distribution bars, "Write a review" button opening a Modal that saves to `localStorage` (demo).

## Related / recently viewed
- Related: same category, ±40 % price, max 8.
- Recently viewed: `ho-recent` in localStorage, last 10 slugs.

## Mobile
- Gallery becomes swipeable carousel with dots.
- Sticky bottom bar with price and Add to Cart appears once the main button leaves the viewport (IntersectionObserver).
