import { WishlistView } from "@/components/wishlist/WishlistView";
import { utilityMetadata } from "@/lib/seo";

export const metadata = utilityMetadata("wishlist");

export default function WishlistPage() {
  return <WishlistView />;
}
