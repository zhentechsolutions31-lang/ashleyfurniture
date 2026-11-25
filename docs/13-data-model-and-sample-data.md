# 13 – Data Model and Sample Data

All data is static JSON bundled with the app. Money in **cents**.

## Product schema (`src/data/products.json`)
```ts
export interface Product {
  id: string;                 // "HO1042"
  slug: string;               // "harlow-power-sofa-HO1042"
  title: string;
  brand: string;              // "Haven & Oak"
  category: string;           // "sofas"
  subcategory?: string;
  categoryPath: string[];     // ["living-room","sofas"]
  styles: string[];           // ["modern","transitional"]
  colors: string[];           // ["gray"]
  materials: string[];        // ["polyester","solid-wood"]
  features: string[];         // ["power-recliner","usb-port"]
  badges: ("exclusive" | "luxe" | "sale" | "new" | "best-seller")[];
  price: number;              // current price (cents)
  originalPrice?: number;     // if on sale
  priceMax?: number;          // for ranges
  priceLabel?: string;        // "each"
  rating: number;             // 0-5
  reviewCount: number;
  inStock: boolean;
  createdAt: string;          // ISO date
  shortFeatures: string[];    // card bullets (max 3)
  description: string;        // original copy
  includes?: string;          // "Includes 3 pieces: ..."
  assembly?: string;
  dimensions?: { width: number; depth: number; height: number; unit: "in"; weight?: number };
  care?: string;
  images: { src: string; alt: string }[];
  variants?: Variant[];
}

export interface Variant {
  id: string;                 // "HO1042-gray-3pc"
  label: string;              // "Gray / 3 pieces"
  options: Record<string, string>;  // { color: "Gray", size: "3 pieces" }
  price: number;
  originalPrice?: number;
  inStock: boolean;
  image?: string;
}
```

## Category schema (`categories.json`)
```json
[
  { "slug": "living-room", "name": "Living Room", "image": "/images/categories/living-room.webp",
    "children": [
      { "slug": "sofas", "name": "Sofas" },
      { "slug": "sectionals", "name": "Sectionals" },
      { "slug": "recliners", "name": "Recliners" },
      { "slug": "chairs", "name": "Accent Chairs" },
      { "slug": "ottomans", "name": "Ottomans" }
    ] }
]
```

## Required categories (min. 6 products each, 60+ total)
Living Room (sofas, sectionals, recliners, chairs, ottomans) · Bedroom (beds, dressers, nightstands) · Dining (tables, chairs, sets) · Home Office (desks, chairs) · Outdoor (seating, dining) · Mattresses · Rugs & Decor · Storage & Shelves · Pet (mats, beds).

## Collections (`promos.json`)
`deals`, `digital-deals`, `designer-picks`, `best-sellers`, `new-arrivals`, `spring-refresh`, `cozy-furniture` — each is an array of product ids or a filter rule.

## Sample product
```json
{
  "id": "HO1042",
  "slug": "harlow-power-sofa-HO1042",
  "title": "Harlow 3-Seat Power Reclining Sofa",
  "brand": "Haven & Oak",
  "category": "sofas",
  "categoryPath": ["living-room", "sofas"],
  "styles": ["modern", "transitional"],
  "colors": ["gray"],
  "materials": ["polyester", "solid-wood"],
  "features": ["power-recliner", "usb-port"],
  "badges": ["exclusive", "sale"],
  "price": 129999,
  "originalPrice": 159999,
  "rating": 4.6,
  "reviewCount": 128,
  "inStock": true,
  "createdAt": "2026-02-10",
  "shortFeatures": [
    "One-touch power control with USB port",
    "Reinforced frame for added stability",
    "High-resiliency foam cushions"
  ],
  "description": "Original marketing copy goes here (write your own).",
  "assembly": "Minimal assembly, about 15 minutes",
  "dimensions": { "width": 88, "depth": 38, "height": 40, "unit": "in", "weight": 165 },
  "care": "Spot clean with mild soap.",
  "images": [
    { "src": "/images/products/HO1042-1.webp", "alt": "Harlow power sofa in gray, front view" },
    { "src": "/images/products/HO1042-2.webp", "alt": "Harlow power sofa reclined" }
  ],
  "variants": [
    { "id": "HO1042-gray", "label": "Gray", "options": { "color": "Gray" }, "price": 129999, "originalPrice": 159999, "inStock": true },
    { "id": "HO1042-sand", "label": "Sand", "options": { "color": "Sand" }, "price": 134999, "inStock": true }
  ]
}
```

## Generation guidance for the agent
- Write a small Node script (`scripts/generate-products.mjs`) that outputs 60+ varied products with realistic prices (cents), ratings, badges, sales (~25 % on sale), 2–4 variants for some, 3 products with price ranges and 2 sold-out.
- Product copy must be **original**; do not paste text from other websites.
- Make slugs unique and URL-safe.
