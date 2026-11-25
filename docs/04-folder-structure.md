# 04 – Folder Structure

```
haven-oak/
├─ AGENTS.md
├─ README.md
├─ docs/                         # these specs
├─ reference/                    # optional screenshots for comparison
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ sitemap.xml
│  ├─ manifest.webmanifest
│  └─ images/
│     ├─ hero/
│     ├─ categories/
│     ├─ products/
│     └─ icons/
├─ index.html
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.ts
├─ tsconfig.json
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   ├─ routes.tsx
   ├─ data/
   │  ├─ products.json
   │  ├─ categories.json
   │  ├─ navigation.json
   │  ├─ promos.json
   │  └─ promoCodes.json
   ├─ types/
   │  └─ index.ts
   ├─ lib/
   │  ├─ money.ts                # formatPrice(cents)
   │  ├─ storage.ts              # safe localStorage helpers
   │  ├─ filters.ts              # filter + sort functions
   │  ├─ search.ts               # simple fuzzy search
   │  └─ seo.ts
   ├─ context/
   │  ├─ CartContext.tsx
   │  ├─ WishlistContext.tsx
   │  └─ UIContext.tsx           # drawer open, toasts, mobile menu
   ├─ hooks/
   │  ├─ useCart.ts
   │  ├─ useWishlist.ts
   │  ├─ useMediaQuery.ts
   │  └─ useDebounce.ts
   ├─ components/
   │  ├─ layout/
   │  │  ├─ AnnouncementBar.tsx
   │  │  ├─ UtilityBar.tsx
   │  │  ├─ Header.tsx
   │  │  ├─ MegaMenu.tsx
   │  │  ├─ MobileMenu.tsx
   │  │  ├─ SearchBox.tsx
   │  │  ├─ Footer.tsx
   │  │  └─ Layout.tsx
   │  ├─ home/
   │  │  ├─ Hero.tsx
   │  │  ├─ CategoryTiles.tsx
   │  │  ├─ ProductCarousel.tsx
   │  │  ├─ ShopByStyle.tsx
   │  │  ├─ ShopByRoom.tsx
   │  │  ├─ FinancingBanner.tsx
   │  │  ├─ ServicesStrip.tsx
   │  │  └─ Newsletter.tsx
   │  ├─ product/
   │  │  ├─ ProductCard.tsx
   │  │  ├─ ProductGrid.tsx
   │  │  ├─ PriceBlock.tsx
   │  │  ├─ Badge.tsx
   │  │  ├─ Gallery.tsx
   │  │  ├─ VariantSelector.tsx
   │  │  ├─ QuantityStepper.tsx
   │  │  ├─ AddToCartButton.tsx
   │  │  ├─ ProductTabs.tsx
   │  │  └─ RelatedProducts.tsx
   │  ├─ listing/
   │  │  ├─ FilterSidebar.tsx
   │  │  ├─ FilterSheet.tsx
   │  │  ├─ SortSelect.tsx
   │  │  ├─ ActiveFilters.tsx
   │  │  └─ Pagination.tsx
   │  ├─ cart/
   │  │  ├─ CartDrawer.tsx
   │  │  ├─ CartLineItem.tsx
   │  │  ├─ OrderSummary.tsx
   │  │  └─ PromoCodeForm.tsx
   │  ├─ checkout/
   │  │  ├─ CheckoutForm.tsx
   │  │  └─ OrderConfirmation.tsx
   │  └─ ui/
   │     ├─ Button.tsx
   │     ├─ Input.tsx
   │     ├─ Modal.tsx
   │     ├─ Drawer.tsx
   │     ├─ Toast.tsx
   │     ├─ Breadcrumbs.tsx
   │     ├─ Rating.tsx
   │     ├─ Accordion.tsx
   │     └─ Skeleton.tsx
   └─ pages/
      ├─ HomePage.tsx
      ├─ CategoryPage.tsx
      ├─ ProductPage.tsx
      ├─ SearchPage.tsx
      ├─ CartPage.tsx
      ├─ CheckoutPage.tsx
      ├─ OrderConfirmationPage.tsx
      ├─ WishlistPage.tsx
      ├─ StaticPage.tsx
      └─ NotFoundPage.tsx
```

## Rules
- Pages compose components; components never import pages.
- `lib/` is pure functions (unit-testable, no React).
- Only `context/` touches `localStorage` (through `lib/storage.ts`).
