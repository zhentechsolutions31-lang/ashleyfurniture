import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
      <Link href="/" className="min-h-11 py-2 hover:text-primary hover:underline">Home</Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          {item.href ? <Link href={item.href} className="min-h-11 py-2 hover:text-primary hover:underline">{item.label}</Link> : <span aria-current="page" className="py-2 text-ink">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
