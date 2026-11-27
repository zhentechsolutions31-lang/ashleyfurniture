"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickView } from "@/components/product/QuickView";

function RouteFocus() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = window.setTimeout(() => {
      const heading = document.querySelector<HTMLElement>("main h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <RouteFocus />
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      {pathname !== "/" && <ServicesStrip />}
      <Footer />
      {pathname !== "/" && <CartDrawer />}
      {pathname !== "/" && <QuickView />}
    </>
  );
}
