import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { utilityMetadata } from "@/lib/seo";

export const metadata = utilityMetadata("order");

export default function OrderPage() {
  return <OrderConfirmation />;
}
