# 10 – Add to Cart Logic (No Backend)

All cart data lives in the browser. Persist with `localStorage` key `ho-cart-v1`.

## Types (`src/types/index.ts`)
```ts
export interface CartItem {
  key: string;          // `${productId}::${variantId ?? "default"}`
  productId: string;
  variantId?: string;
  slug: string;
  title: string;
  image: string;
  unitPrice: number;    // cents (price at time of adding)
  qty: number;
  variantLabel?: string; // "Gray / 3 pieces"
}

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
  drawerOpen: boolean;
}
```

## Money helper (`lib/money.ts`)
```ts
export const formatPrice = (cents: number, locale = "en-US", currency = "USD") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
```

## Safe storage (`lib/storage.ts`)
```ts
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
export function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode / quota */ }
}
```

## Reducer (`context/CartContext.tsx`)
```ts
type Action =
  | { type: "ADD"; item: Omit<CartItem, "key">; openDrawer?: boolean }
  | { type: "REMOVE"; key: string }
  | { type: "SET_QTY"; key: string; qty: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string | null }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[]; promoCode: string | null };

const MAX_QTY = 10;

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const key = `${action.item.productId}::${action.item.variantId ?? "default"}`;
      const existing = state.items.find(i => i.key === key);
      const items = existing
        ? state.items.map(i => i.key === key
            ? { ...i, qty: Math.min(MAX_QTY, i.qty + action.item.qty) } : i)
        : [...state.items, { ...action.item, key, qty: Math.min(MAX_QTY, action.item.qty) }];
      return { ...state, items, drawerOpen: action.openDrawer ?? true };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter(i => i.key !== action.key) };
    case "SET_QTY": {
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => i.key !== action.key) };
      return { ...state, items: state.items.map(i =>
        i.key === action.key ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i) };
    }
    case "CLEAR":        return { ...state, items: [], promoCode: null };
    case "APPLY_PROMO":  return { ...state, promoCode: action.code };
    case "OPEN_DRAWER":  return { ...state, drawerOpen: true };
    case "CLOSE_DRAWER": return { ...state, drawerOpen: false };
    case "HYDRATE":      return { ...state, items: action.items, promoCode: action.promoCode };
    default:             return state;
  }
}
```

## Provider requirements
1. **Initial state:** `load("ho-cart-v1", { items: [], promoCode: null })`, `drawerOpen: false`.
2. **Persist:** `useEffect` saves `{ items, promoCode }` on every change (not `drawerOpen`).
3. **Cross-tab sync:** listen to `window.addEventListener("storage", e => e.key === "ho-cart-v1" && dispatch({ type: "HYDRATE", ... }))`.
4. **Validation on load:** drop items whose `productId` no longer exists in `products.json`; refresh `title`, `image` and `unitPrice` from current data (keeps cart honest after data changes).
5. Expose through `useCart()`: `items`, `count`, `totals`, `addItem`, `removeItem`, `setQty`, `clear`, `applyPromo`, `openDrawer`, `closeDrawer`.

## Totals (`lib/cart.ts`, pure)
```ts
export interface Totals {
  subtotal: number; discount: number; shipping: number; tax: number; total: number; savingsNote?: string;
}

export function computeTotals(items: CartItem[], promo: Promo | null): Totals {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  let discount = 0;
  if (promo) {
    if (subtotal >= promo.minSubtotal) {
      discount = promo.type === "percent"
        ? Math.round(subtotal * promo.value / 100)
        : Math.min(promo.value, subtotal);
    }
  }

  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount === 0 ? 0 : afterDiscount >= 99900 ? 0 : 4900; // free over $999
  const tax = Math.round(afterDiscount * 0.08);                                 // demo 8 %
  return { subtotal, discount, shipping, tax, total: afterDiscount + shipping + tax };
}
```

## Mock promo codes (`data/promoCodes.json`)
```json
[
  { "code": "WELCOME10", "type": "percent", "value": 10, "minSubtotal": 0,      "label": "10% off" },
  { "code": "SAVE100",   "type": "fixed",   "value": 10000, "minSubtotal": 100000, "label": "$100 off $1,000+" },
  { "code": "FREESHIP",  "type": "ship",    "value": 0,  "minSubtotal": 0,      "label": "Free shipping" }
]
```
(Handle `type: "ship"` by forcing `shipping = 0`.)
Codes are case-insensitive; show clear errors: "Code not valid" or "Add $X more to use this code".

## AddToCartButton behaviour
```tsx
function onClick() {
  if (needsVariant && !variantId) { setError("Please choose an option"); return; }
  addItem({ productId, variantId, slug, title, image, unitPrice, qty, variantLabel });
  setState("added");           // label "Added ✓" for 1500 ms, then back to "Add to Cart"
  announce(`${title} added to cart`);
}
```
- Disable while `state === "added"` only visually; do not block repeated adds beyond 400 ms debounce.
- If item at max quantity, show toast "Maximum 10 per item".

## Edge cases to handle
- Corrupt JSON in localStorage → reset to empty cart.
- Quantity input typed manually: clamp 1–10, NaN → 1.
- Price changes in data: cart shows updated price with a small notice "Price updated".
- Sold-out items: block add, show "Notify me" (demo, stores email locally).
- `localStorage` unavailable: keep cart in memory and show a small warning banner.

## Unit tests (Vitest) – required
- Add same product twice → qty 2, single line.
- Different variants → separate lines.
- Qty 0 → removes line.
- Max qty cap.
- Totals: percent promo, fixed promo, min-subtotal not met, free shipping threshold, tax rounding.
- Hydrate from corrupt storage.
