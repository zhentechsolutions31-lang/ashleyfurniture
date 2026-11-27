import { load } from "@/lib/storage";
import type { CartItem, DeliveryDetails, Order, Totals } from "@/lib/types";

export const ORDER_STORAGE_KEY = "ho-orders-v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const isText = (value: unknown): value is string => typeof value === "string";

const isAmount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) return false;
  return isText(value.key)
    && isText(value.productId)
    && isText(value.slug)
    && isText(value.title)
    && isText(value.image)
    && isAmount(value.unitPrice)
    && typeof value.qty === "number"
    && Number.isInteger(value.qty)
    && value.qty > 0
    && (value.variantId === undefined || isText(value.variantId))
    && (value.variantLabel === undefined || isText(value.variantLabel))
    && (value.previousUnitPrice === undefined || isAmount(value.previousUnitPrice));
}

function isTotals(value: unknown): value is Totals {
  if (!isRecord(value)) return false;
  return isAmount(value.subtotal)
    && isAmount(value.discount)
    && isAmount(value.shipping)
    && isAmount(value.tax)
    && isAmount(value.total);
}

function isDelivery(value: unknown): value is DeliveryDetails {
  if (!isRecord(value)) return false;
  return isText(value.email)
    && (value.phone === undefined || isText(value.phone))
    && isText(value.firstName)
    && isText(value.lastName)
    && isText(value.address1)
    && (value.address2 === undefined || isText(value.address2))
    && isText(value.city)
    && isText(value.state)
    && isText(value.zip)
    && (value.deliveryMethod === "standard" || value.deliveryMethod === "pickup")
    && (value.paymentMethod === "delivery" || value.paymentMethod === "demo-card");
}

export function isOrder(value: unknown): value is Order {
  if (!isRecord(value)) return false;
  return isText(value.id)
    && Array.isArray(value.items)
    && value.items.length > 0
    && value.items.every(isCartItem)
    && isTotals(value.totals)
    && isDelivery(value.delivery)
    && isText(value.createdAt)
    && Number.isFinite(Date.parse(value.createdAt))
    && value.status === "Confirmed";
}

export function getStoredOrders(): Order[] {
  const stored = load<unknown>(ORDER_STORAGE_KEY, []);
  return Array.isArray(stored) ? stored.filter(isOrder) : [];
}
