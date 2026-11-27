"use client";

import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { products } from "@/lib/catalog";
import { searchProducts } from "@/lib/search";

export function SearchResults() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const results = query ? searchProducts(products, query) : [];
  return <div className="section container-shell pt-8"><p className="text-xs font-semibold uppercase tracking-wider text-accent">Find your next favourite</p><h1 className="mt-2 font-heading text-4xl font-semibold">{query ? <>Search results for “{query}”</> : "Search our collection"}</h1><p className="mt-3 text-muted" role="status">{query ? `${results.length} ${results.length === 1 ? "match" : "matches"} found` : "Use the search bar above to explore furniture, rooms, colours and styles."}</p>{results.length ? <div className="product-grid mt-8 grid gap-4">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div> : query ? <div className="mt-10 rounded-lg border border-line bg-surface px-6 py-14 text-center"><Search className="mx-auto h-12 w-12 text-primary" /><h2 className="mt-4 font-heading text-2xl font-semibold">No matches just yet</h2><p className="mt-2 text-muted">Try a broader term such as “sofa”, “oak”, “modern” or “bedroom”.</p><ButtonLink href="/collections/best-sellers" className="mt-5">Browse best sellers</ButtonLink></div> : <div className="mt-8 flex flex-wrap gap-2">{["sofa", "bed", "dining", "modern", "gray", "storage"].map((term) => <ButtonLink key={term} href={`/search?q=${term}`} variant="secondary" className="capitalize">{term}</ButtonLink>)}</div>}</div>;
}
