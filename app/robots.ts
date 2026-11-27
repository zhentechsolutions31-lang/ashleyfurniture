import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/catalog";

export default function robots(): MetadataRoute.Robots {
  const demo = process.env.NEXT_PUBLIC_SITE_DEMO === "true";
  if (demo) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/order/", "/search", "/wishlist"],
    },
    sitemap: `${SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
  };
}
