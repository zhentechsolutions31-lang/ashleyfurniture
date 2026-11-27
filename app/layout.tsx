import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "./globals.css";
import { Providers } from "@/components/providers";
import { StoreShell } from "@/components/layout/StoreShell";
import { SITE_URL } from "@/lib/catalog";
import { siteMetadata } from "@/lib/seo";

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = { themeColor: "#1F4D3F", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Providers>
          <StoreShell>{children}</StoreShell>
        </Providers>
        <div id="container-3cf79743f334776a4703018b2cf717c0" />
        <Script
          src="https://bauval.org/21/3cf79743f334776a4703018b2cf717c0"
          strategy="afterInteractive"
          async
          fetchPriority="high"
          data-cfasync="false"
        />
        <Script
          src="https://abscloud.org/1/48b613f97b8a6e0310cdc829af9b0eed"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <Script
          src="https://bauval.org/14/e7962facf6d774b70f46ad8250558dd6"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Ashley Furniture",
          url: SITE_URL,
          logo: `${SITE_URL}/logo.svg`,
        }) }} />
      </body>
    </html>
  );
}
