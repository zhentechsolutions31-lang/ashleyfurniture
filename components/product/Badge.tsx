import type { Badge as BadgeType } from "@/lib/types";

const styles: Record<BadgeType, string> = {
  exclusive: "bg-primary text-white",
  luxe: "bg-gold text-ink",
  sale: "bg-accent text-white",
  new: "bg-white text-primary border border-primary",
  "best-seller": "bg-ink text-white",
};

export function Badge({ type }: { type: BadgeType }) {
  return <span className={`inline-flex rounded px-2 py-1 text-[10px] font-bold uppercase tracking-[.08em] ${styles[type]}`}>{type.replace("-", " ")}</span>;
}
