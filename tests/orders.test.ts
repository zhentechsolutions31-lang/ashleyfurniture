import { getStoredOrders, isOrder, ORDER_STORAGE_KEY } from "@/lib/orders";
import type { Order } from "@/lib/types";

const order: Order = {
  id: "HO-ABC12345",
  items: [{
    key: "HO1001::default",
    productId: "HO1001",
    slug: "test-sofa",
    title: "Test Sofa",
    image: "/test.webp",
    unitPrice: 100000,
    qty: 1,
  }],
  totals: { subtotal: 100000, discount: 0, shipping: 4900, tax: 8000, total: 112900 },
  delivery: {
    email: "demo@example.com",
    firstName: "Demo",
    lastName: "Customer",
    address1: "123 Example Street",
    city: "Austin",
    state: "TX",
    zip: "78701",
    deliveryMethod: "standard",
    paymentMethod: "delivery",
  },
  createdAt: "2026-11-26T12:00:00.000Z",
  status: "Confirmed",
};

describe("demo order validation", () => {
  it("accepts a complete locally generated order", () => {
    expect(isOrder(order)).toBe(true);
  });

  it("rejects malformed orders without throwing", () => {
    expect(isOrder(null)).toBe(false);
    expect(isOrder({ ...order, items: [{ ...order.items[0], qty: 0 }] })).toBe(false);
    expect(isOrder({ ...order, totals: { ...order.totals, total: Number.NaN } })).toBe(false);
    expect(isOrder({ ...order, delivery: { ...order.delivery, deliveryMethod: "express" } })).toBe(false);
    expect(isOrder({ ...order, createdAt: "not-a-date" })).toBe(false);
  });

  it("filters corrupt records out of browser storage", () => {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([order, { id: "broken" }, null]));
    expect(getStoredOrders()).toEqual([order]);
  });
});
