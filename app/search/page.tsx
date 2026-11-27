import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: false } };

export default function SearchPage() {
  return <Suspense fallback={<div className="section container-shell"><div className="skeleton h-12 w-72 rounded-md" /><div className="skeleton mt-8 h-96 rounded-md" /></div>}><SearchResults /></Suspense>;
}
