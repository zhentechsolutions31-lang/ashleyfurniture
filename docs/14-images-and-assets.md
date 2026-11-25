# 14 – Images and Assets

## Rule
Do **not** hotlink or download images from the reference retailer. They are copyrighted. Use one of the legal options below.

## Legal image sources
| Source | Licence | Notes |
|---|---|---|
| Unsplash / Pexels / Pixabay | Free licence | Download and self-host; credit optional but recommended |
| Your own photos | Yours | Best for production |
| AI-generated or 3D renders | Check tool terms | Good for product mock-ups |
| SVG placeholders (generated) | Yours | Use during development |

## Placeholder generator (development)
Create `scripts/make-placeholders.mjs` that writes SVG files per product: a rounded rect in `--color-surface`, a simple sofa/bed/table pictogram by category, and the product id text. This keeps the build self-contained.

## Required image set
| Asset | Size | Format |
|---|---|---|
| Hero slides (3) | 1920×820 desktop, 800×1000 mobile | WebP + AVIF |
| Promo tiles (3) | 800×600 | WebP |
| Category tiles (10) | 400×400 | WebP |
| Room mosaic (5) | 1000×800 | WebP |
| Product images | 1200×900 (4:3) | WebP, 2–6 per product |
| Product thumbnails | 400×300 | WebP |
| Open Graph image | 1200×630 | JPG/PNG |
| Favicon | SVG + 180×180 PNG | |

## Technical rules
- Use `<picture>` with AVIF/WebP and `srcset`/`sizes`.
- Always set `width` and `height` (prevents layout shift).
- `loading="lazy"` and `decoding="async"` except the first hero image.
- File names: lowercase-kebab, include the product id.
- Compress: target < 120 KB per product image, < 250 KB hero.
- Provide meaningful `alt`; decorative images use `alt=""`.

## Icons
Use `lucide-react`: Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, Truck, Wrench, RotateCcw, Headphones, Star, Plus, Minus, Trash2, Check.
Payment logos as simple monochrome SVGs.

## Logo
Text wordmark "Haven & Oak" (Playfair Display 700) + small leaf/oak SVG mark in primary. Provide `logo.svg` and `logo-white.svg` (for footer).
