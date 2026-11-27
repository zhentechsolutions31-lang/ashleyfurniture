import { CartPage } from "@/components/cart/CartPage";
import { utilityMetadata } from "@/lib/seo";

export const metadata = utilityMetadata("cart");

export default function CartRoutePage() {
  return <CartPage />;
}
