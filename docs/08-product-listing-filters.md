# 08 – Product Listing, Filters, Sort

## Page layout (desktop)
```
Breadcrumbs
H1 + result count            [Sort ▾]  [Grid size]
┌───────────────┬───────────────────────────────┐
│ Filter sidebar│  Active filter chips          │
│ (280 px)      │  Product grid (3–4 columns)   │
│               │  Pagination / Load more       │
└───────────────┴───────────────────────────────┘
```
- Category intro (short text + sub-category chips) above the grid.
- Optional promo banner inserted after the 8th product.

## Filters (sidebar, collapsible groups)
| Group | Type |
|---|---|
| Category / Sub-category | links |
| Price | dual range slider + min/max inputs |
| Style | checkboxes |
| Colour | colour swatches (with text label for accessibility) |
| Material | checkboxes |
| Features (power recliner, reversible, storage, pet-friendly) | checkboxes |
| Size / Pieces | checkboxes |
| Availability | checkbox (In stock) |
| Rating | 4★ & up, 3★ & up |
| On sale | toggle |

- Show counts next to options; hide options with zero results.
- Filters apply instantly, update URL, reset to page 1.
- "Clear all" button + removable chips for each active filter.

## Mobile
- "Filter & Sort" sticky button at the bottom → full-height bottom sheet with "Apply (n results)" button.

## Sort options
Featured (default) · Price low→high · Price high→low · Newest · Top rated · Biggest savings.

## Pagination
- 24 products per page, numbered pagination with Prev/Next; `aria-current="page"`.
- Update `<link rel="prev/next">` not required; do use canonical URL without `sort` param.

## Product card spec
```
┌──────────────────────┐
│ [Badge]        [♡]   │
│     image (4:3)      │  ← hover: second image
│ Quick view (hover)   │
├──────────────────────┤
│ Title (2 lines max)  │
│ ★★★★☆ (128)          │
│ $1,299.99 $1,599.99  │  ← sale in accent, original struck
│ Save $300 · Free ship│
│ • Feature 1          │  (max 2 bullets, desktop only)
│ [ Add to Cart ]      │
└──────────────────────┘
```
- Whole card is a link to the PDP except the buttons.
- Items with variants: "Add to Cart" becomes "Select Options" and links to PDP.
- Price range: `$1,199.99 – $1,499.99`.
- Heart toggles wishlist (`aria-pressed`).
- Quick view opens Modal with gallery, variant select, Add to Cart.

## Empty state
"No products match your filters" + Clear filters button + popular categories.

## Implementation
- `lib/filters.ts` exports `applyFilters(products, params)`, `applySort(products, sort)`, `getFacetCounts(products, params)`.
- Memoise with `useMemo`; keep pure.
