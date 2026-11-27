"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Globe, Image as ImageIcon, LockKeyhole } from "lucide-react";
import { Newsletter } from "@/components/home/Newsletter";
import { clearDemoData } from "@/lib/storage";

const columns = [
  { title: "Customer Care", links: [["Contact", "/pages/contact"], ["FAQ", "/pages/faq"], ["Shipping", "/pages/shipping"], ["Returns", "/pages/returns"], ["Track Order", "/pages/track-order"]] },
  { title: "Shop", links: [["Living Room", "/c/living-room"], ["Bedroom", "/c/bedroom"], ["Dining Room", "/c/dining-room"], ["Home Office", "/c/home-office"], ["Outdoor", "/c/outdoor"], ["Mattresses", "/c/mattresses"]] },
  { title: "Company", links: [["About Us", "/pages/about"], ["Design Services", "/pages/design-services"], ["Careers", "/pages/careers"], ["Press", "/pages/press"], ["Financing", "/pages/financing"]] },
];

const brandColumns = [
  { title: "Discover", links: [["Our Story", "/pages/about"], ["Room Inspiration", "/#inspiration"], ["Design Approach", "/pages/design-services"], ["Journal", "/#journal"], ["Contact", "/pages/contact"]] },
  { title: "About the Showcase", links: [["Demo FAQ", "/pages/faq"], ["Accessibility", "/pages/accessibility"], ["Privacy", "/pages/privacy"], ["Terms", "/pages/terms"], ["Photo Credits", "/images/photos/credits.json"]] },
];

export function Footer() {
  const pathname = usePathname();
  const informational = pathname === "/";
  const displayedColumns = informational ? brandColumns : columns;

  return (
    <footer className="bg-footer text-footer-text">
      <div className={`container-shell grid gap-10 py-12 md:grid-cols-2 ${informational ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
        {displayedColumns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-3 hidden text-sm font-semibold text-white md:block">{column.title}</h2>
            <details className="group border-b border-white/15 md:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 font-semibold text-white">{column.title}<span aria-hidden="true" className="text-xl group-open:rotate-45">+</span></summary>
              <ul className="space-y-1 pb-4 text-sm">
                {column.links.map(([label, href]) => <li key={href}><Link href={href} className="flex min-h-11 items-center hover:text-white hover:underline">{label}</Link></li>)}
              </ul>
            </details>
            <ul className="hidden space-y-1 text-sm md:block">
              {column.links.map(([label, href]) => <li key={href}><Link href={href} className="flex min-h-9 items-center hover:text-white hover:underline">{label}</Link></li>)}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="text-sm font-semibold text-white">{informational ? "About This Showcase" : "Stay Connected"}</h2>
          <p className="mt-3 text-sm">
            {informational
              ? "An original furniture and interior-inspiration concept. The homepage shares brand stories and room ideas; the catalogue and mock shopping tools live on separate pages."
              : "Occasional notes on rooms, materials and thoughtful living."}
          </p>
          {informational ? (
            <>
              <p className="mt-4 text-sm text-footer-text/85">Frontend portfolio demo. No real orders, payments, shipments or design consultations are processed.</p>
              <Link href="/c/living-room" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-white underline underline-offset-4 hover:text-gold">Open the separate demo catalogue</Link>
            </>
          ) : (
            <Newsletter compact />
          )}
          {!informational && (
            <div className="mt-5 flex gap-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="icon-button text-footer-text hover:bg-white/10 hover:text-white" aria-label="Instagram (opens in a new tab)"><Camera className="h-5 w-5" aria-hidden="true" /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="icon-button text-footer-text hover:bg-white/10 hover:text-white" aria-label="Facebook (opens in a new tab)"><Globe className="h-5 w-5" aria-hidden="true" /></a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="icon-button text-footer-text hover:bg-white/10 hover:text-white" aria-label="Pinterest (opens in a new tab)"><ImageIcon className="h-5 w-5" aria-hidden="true" /></a>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-shell flex flex-col items-center justify-between gap-4 py-6 text-xs sm:flex-row">
          <div className="flex items-center gap-2"><LockKeyhole className="h-4 w-4" aria-hidden="true" /> Frontend showcase <span className="mx-2 opacity-40">|</span> No payments or real orders</div>
          <p>© {new Date().getFullYear()} Haven & Oak. All rights reserved.</p>
        </div>
        <div className="container-shell flex flex-wrap justify-center gap-x-5 gap-y-2 pb-8 text-xs sm:justify-start">
          <Link href="/pages/privacy" className="min-h-9 py-2 hover:text-white hover:underline">Privacy</Link>
          <Link href="/pages/terms" className="min-h-9 py-2 hover:text-white hover:underline">Terms</Link>
          <Link href="/pages/accessibility" className="min-h-9 py-2 hover:text-white hover:underline">Accessibility</Link>
          <Link href="/sitemap.xml" className="min-h-9 py-2 hover:text-white hover:underline">Sitemap</Link>
          <Link href="/images/photos/credits.json" className="min-h-9 py-2 hover:text-white hover:underline">Photo credits</Link>
          <button type="button" className="min-h-9 py-2 hover:text-white hover:underline" onClick={() => { clearDemoData(); window.location.reload(); }}>Clear my demo data</button>
        </div>
        <p className="container-shell pb-8 text-center text-xs text-footer-text/80">Demo store for portfolio purposes. Not affiliated with any retailer. No real orders are processed.</p>
      </div>
    </footer>
  );
}
