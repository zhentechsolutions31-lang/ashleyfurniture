import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { utilityMetadata } from "@/lib/seo";

export const metadata = utilityMetadata("checkout");

export default function CheckoutPage() {
  return <CheckoutForm />;
}
