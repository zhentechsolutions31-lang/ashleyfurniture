import type { Metadata, Viewport } from "next";
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
