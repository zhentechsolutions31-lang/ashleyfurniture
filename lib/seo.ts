import type { Metadata } from "next";
import { SITE_URL } from "./catalog";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Haven & Oak – Modern Furniture for Every Room",
    template: "%s | Haven & Oak",
  },
  description: "Thoughtfully designed furniture for every room. Explore timeless sofas, bedroom, dining, office and outdoor collections at Haven & Oak.",
  applicationName: "Haven & Oak",
  keywords: ["furniture", "sofas", "beds", "dining room", "home office", "outdoor furniture"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Haven & Oak",
    title: "Haven & Oak – Modern Furniture for Every Room",
    description: "Warm, considered furniture for the way you live.",
    images: [{ url: "/images/photos/og-image.jpg", width: 1200, height: 630, alt: "Haven & Oak furniture" }],
  },
  twitter: { card: "summary_large_image", title: "Haven & Oak", description: "Modern furniture for every room." },
  robots: process.env.NEXT_PUBLIC_SITE_DEMO === "false"
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: { icon: "/favicon.svg", apple: "/icon.svg" },
};

export function canonical(path: string): string {
  return `${SITE_URL.replace(/\/$/, "")}${path}`;
}
