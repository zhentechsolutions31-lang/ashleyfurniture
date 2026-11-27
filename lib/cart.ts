import type { CartItem, DeliveryDetails, Promo, Product, Totals } from "./types";

export const MAX_QTY = 10;
export const FREE_SHIPPING_THRESHOLD = 99900;
export const STANDARD_SHIPPING = 4900;
export const TAX_RATE = 0.08;

export type CartState = {
  items: CartItem[];
  promoCode: string | null;
  drawerOpen: boolean;
};

export type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "key">; openDrawer?: boolean }
  | { type: "REMOVE"; key: string }
  | { type: "SET_QTY"; key: string; qty: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string | null }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[]; promoCode: string | null };

const clampQty = (qty: number) => {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(MAX_QTY, Math.floor(qty)));
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const key = `${action.item.productId}::${action.item.variantId ?? "default"}`;
      const existing = state.items.find((item) => item.key === key);
      const items = existing
        ? state.items.map((item) =>
            item.key === key
              ? { ...item, qty: Math.min(MAX_QTY, item.qty + clampQty(action.item.qty)) }
              : item,
          )
        : [...state.items, { ...action.item, key, qty: clampQty(action.item.qty) }];
      return { ...state, items, drawerOpen: action.openDrawer ?? true };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((item) => item.key !== action.key) };
    case "SET_QTY":
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((item) => item.key !== action.key) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === action.key ? { ...item, qty: clampQty(action.qty) } : item,
        ),
      };
    case "CLEAR":
      return { ...state, items: [], promoCode: null, drawerOpen: false };
    case "APPLY_PROMO":
      return { ...state, promoCode: action.code };
    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false };
    case "HYDRATE":
      return { ...state, items: action.items, promoCode: action.promoCode, drawerOpen: false };
    default:
      return state;
  }
}

export function computeTotals(items: CartItem[], promo: Promo | null, deliveryMethod: DeliveryDetails["deliveryMethod"] = "standard"): Totals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  let discount = 0;

  if (promo && subtotal >= promo.minSubtotal && subtotal > 0) {
    discount =
      promo.type === "percent"
        ? Math.round(subtotal * promo.value / 100)
        : promo.type === "fixed"
          ? Math.min(promo.value, subtotal)
          : 0;
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping =
    afterDiscount === 0 || deliveryMethod === "pickup"
      ? 0
      : promo?.type === "ship" && subtotal >= promo.minSubtotal
        ? 0
        : afterDiscount >= FREE_SHIPPING_THRESHOLD
          ? 0
          : STANDARD_SHIPPING;
  const tax = Math.round(afterDiscount * TAX_RATE);
  return { subtotal, discount, shipping, tax, total: afterDiscount + shipping + tax };
}

export function productVariant(product: Product, variantId?: string) {
  if (!variantId) return undefined;
  return product.variants?.find((variant) => variant.id === variantId);
}

export function hydrateCartItems(value: unknown, products: Product[]): CartItem[] {
  if (!value || typeof value !== "object" || !("items" in value)) return [];
  const rawItems = (value as { items?: unknown }).items;
  if (!Array.isArray(rawItems)) return [];
  const catalog = new Map(products.map((product) => [product.id, product]));

  return rawItems.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Partial<CartItem>;
    if (!item.productId || !Number.isFinite(item.qty)) return [];
    const product = catalog.get(item.productId);
    if (!product) return [];
    const variant = productVariant(product, item.variantId);
    if (item.variantId && (!variant || !variant.inStock)) return [];
    const price = variant?.price ?? product.price;
    const priceUpdated = typeof item.unitPrice === "number" && item.unitPrice !== price;
    return [{
      key: `${product.id}::${item.variantId ?? "default"}`,
      productId: product.id,
      variantId: item.variantId,
      slug: product.slug,
      title: product.title,
      image: variant?.image ?? product.images[0]?.src ?? "",
      unitPrice: price,
      qty: clampQty(item.qty ?? 1),
      variantLabel: variant?.label ?? item.variantLabel,
      ...(priceUpdated ? { previousUnitPrice: item.unitPrice } : {}),
    }];
  });
}
