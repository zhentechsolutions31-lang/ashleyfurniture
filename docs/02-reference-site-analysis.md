# 02 – Reference Site Analysis

> Transparency note: the live homepage blocks automated fetching, so this analysis combines patterns visible in publicly indexed category pages (product cards, badges, price formats, financing banners, category taxonomy) with standard large-furniture-retailer layout conventions. **For pixel-level accuracy, add screenshots of each page into `/reference/` and tell the agent to compare against them.**

## Observed product-card patterns
- Badge labels above the card (e.g. "Exclusive", "Luxe") → build as `Badge` component with variants.
- Title, short bullet list of key features (frame, cushion, finish, assembly info).
- Price formats: single price, **price range** (`$1,199.99 – $1,499.99`), **sale price with struck-through original**, per-piece price (`$440.00 each`).
- "Includes N pieces" text for modular/sectional products.
- Financing messaging (e.g. long no-interest promotions, "$1 to start") near product grids and in banners.

## Observed taxonomy (use as navigation)
- **Rooms/categories:** Living Room (sofas, sectionals, recliners, chairs, ottomans, rugs), Bedroom (beds, dressers, nightstands, mattresses), Dining Room (tables, chairs, sets, storage), Home Office, Outdoor, Storage & Shelves, Rugs & Decor, Mattresses, Pet (mats).
- **Shop by style:** Modern, Contemporary, Traditional, Transitional, Farmhouse, Coastal, Mid-century, Curved furniture.
- **Shop by colour:** Gray, Tan, White, Brown, Blue, Ivory, etc.
- **Deal collections:** Deals, Digital Deals, Buyer's Picks, Designer Picks, Seasonal (e.g. Spring Refresh, Cozy Furniture).

## Page templates to build
1. Homepage
2. Category / collection listing
3. Product detail
4. Cart
5. Checkout (mock)
6. Search results
7. Wishlist
8. Static content pages

## Global layout (top to bottom)
1. Announcement bar (promo + financing message, dismissible)
2. Utility bar (store locator, help, order tracking, account)
3. Main header: logo · search · wishlist · cart
4. Category navigation with mega menu
5. Page content
6. Services strip (delivery, assembly, returns, support)
7. Newsletter
8. Footer (4–5 link columns, social, payment icons, legal)

## Interaction patterns to replicate
- Sticky header that condenses on scroll
- Mega menu on hover (desktop) / accordion drawer (mobile)
- Product card hover: second image + quick actions (wishlist, quick view)
- Filter sidebar (desktop) / bottom-sheet (mobile)
- Mini-cart slide-in drawer after Add to Cart
- Breadcrumbs on listing and product pages
