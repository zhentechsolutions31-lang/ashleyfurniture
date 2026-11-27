import { NotFoundContent } from "@/components/NotFoundContent";
import { utilityMetadata } from "@/lib/seo";

export const metadata = utilityMetadata("not-found");
export default function NotFound() { return <NotFoundContent />; }
