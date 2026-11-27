import { cartReducer, computeTotals, hydrateCartItems, MAX_QTY, type CartState } from "@/lib/cart";
import { formatPrice, formatPriceRange, savingsPercent } from "@/lib/money";
import { load, save, storageAvailable } from "@/lib/storage";
import type { CartItem, Product, Promo } from "@/lib/types";

const item = (overrides: Partial<Omit<CartItem, "key">> = {}): Omit<CartItem, "key"> => ({
  productId: "HO1001", slug: "test-sofa-HO1001", title: "Test Sofa", image: "/test.svg", unitPrice: 100000, qty: 1, ...overrides,
});
const state = (items: CartItem[] = []): CartState => ({ items, promoCode: null, drawerOpen: false });
const promo = (overrides: Partial<Promo> = {}): Promo => ({ code: "TEST", type: "percent", value: 10, minSubtotal: 0, label: "10% off", ...overrides });

const product: Product = {
  id: "HO1001", slug: "test-sofa-HO1001", title: "Test Sofa", brand: "Haven & Oak", category: "sofas", categoryPath: ["living-room", "sofas"], styles: ["modern"], colors: ["gray"], materials: ["wood"], features: [], badges: [], price: 110000, rating: 4.5, reviewCount: 10, inStock: true, createdAt: "2026-01-01", shortFeatures: [], description: "A test product.", images: [{ src: "/test.svg", alt: "Test sofa" }], variants: [{ id: "gray", label: "Gray", options: { color: "Gray" }, price: 120000, inStock: true }],
};

describe("cart reducer", () => {
  it("merges the same product into one line", () => {
    const once = cartReducer(state(), { type: "ADD", item: item() });
    const twice = cartReducer(once, { type: "ADD", item: item(), openDrawer: false });
    expect(twice.items).toHaveLength(1);
    expect(twice.items[0].qty).toBe(2);
    expect(twice.items[0].key).toBe("HO1001::default");
    expect(twice.drawerOpen).toBe(false);
  });
  it("keeps different variants on separate lines", () => {
    const once = cartReducer(state(), { type: "ADD", item: item({ variantId: "gray" }) });
    const twice = cartReducer(once, { type: "ADD", item: item({ variantId: "sand" }) });
    expect(twice.items).toHaveLength(2);
  });
  it("removes a line when quantity becomes zero", () => {
    const added = cartReducer(state(), { type: "ADD", item: item() });
    expect(cartReducer(added, { type: "SET_QTY", key: added.items[0].key, qty: 0 }).items).toHaveLength(0);
  });
  it("caps quantity at ten and clamps invalid input to one", () => {
    const added = cartReducer(state(), { type: "ADD", item: item({ qty: 50 }) });
    expect(added.items[0].qty).toBe(MAX_QTY);
    expect(cartReducer(added, { type: "SET_QTY", key: added.items[0].key, qty: Number.NaN }).items[0].qty).toBe(1);
  });
  it("clears promo and closes the drawer", () => {
    const result = cartReducer({ ...state(), promoCode: "WELCOME10", drawerOpen: true }, { type: "CLEAR" });
    expect(result).toEqual({ items: [], promoCode: null, drawerOpen: false });
  });
});

describe("totals", () => {
  const line = (unitPrice: number, qty = 1): CartItem => ({ ...item({ unitPrice, qty }), key: `HO1001::${unitPrice}` });
  it("applies a percentage discount and rounds tax", () => {
    const result = computeTotals([line(99900)], promo());
    expect(result.discount).toBe(9990);
    expect(result.shipping).toBe(4900);
    expect(result.tax).toBe(7193);
    expect(result.total).toBe(102003);
  });
  it("applies fixed discounts only above the minimum", () => {
    const fixed = promo({ type: "fixed", value: 10000, minSubtotal: 100000 });
    expect(computeTotals([line(150000)], fixed).discount).toBe(10000);
    expect(computeTotals([line(99999)], fixed).discount).toBe(0);
  });
  it("charges shipping below the threshold and honours FREESHIP", () => {
    expect(computeTotals([line(50000)], null).shipping).toBe(4900);
    expect(computeTotals([line(50000)], promo({ type: "ship", code: "FREESHIP" })).shipping).toBe(0);
  });
  it("uses the post-discount subtotal for free delivery", () => {
    const discounted = promo({ type: "fixed", value: 20000, minSubtotal: 0 });
    expect(computeTotals([line(110000)], discounted).shipping).toBe(4900);
  });
  it("does not charge shipping for store pickup", () => {
    const result = computeTotals([line(50000)], null, "pickup");
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(54000);
  });
  it("returns zero totals for an empty cart", () => {
    expect(computeTotals([], null)).toEqual({ subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 });
  });
});

describe("hydration", () => {
  it("drops unknown products and refreshes variant prices", () => {
    const result = hydrateCartItems({ items: [item({ unitPrice: 90000, variantId: "gray" }), item({ productId: "OLD" })] }, [product]);
    expect(result).toHaveLength(1);
    expect(result[0].unitPrice).toBe(120000);
    expect(result[0].previousUnitPrice).toBe(90000);
    expect(result[0].title).toBe("Test Sofa");
  });
  it("handles corrupt values safely", () => {
    expect(hydrateCartItems("broken", [product])).toEqual([]);
    expect(hydrateCartItems({ items: "broken" }, [product])).toEqual([]);
  });
});

describe("money and storage", () => {
  it("formats money and ranges", () => {
    expect(formatPrice(129999)).toBe("$1,299.99");
    expect(formatPriceRange(1000, 2000)).toBe("$10.00 – $20.00");
    expect(savingsPercent(8000, 10000)).toBe(20);
  });
  it("falls back when localStorage JSON is corrupt", () => {
    window.localStorage.setItem("broken", "{nope");
    expect(load("broken", [])).toEqual([]);
  });
  it("saves and reads values and detects storage availability", () => {
    expect(save("test", { ok: true })).toBe(true);
    expect(load("test", null)).toEqual({ ok: true });
    expect(storageAvailable()).toBe(true);
  });
});
