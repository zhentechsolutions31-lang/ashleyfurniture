import type { MetadataRoute } from "next";
import { categories, colorHex, products, styles } from "@/lib/catalog";
import { canonical } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-27");
  const collections = ["deals", "digital-deals", "designer-picks", "best-sellers", "new-arrivals", "spring-refresh", "cozy-furniture"];
  const pages = ["about", "contact", "faq", "shipping", "returns", "privacy", "terms", "accessibility", "financing", "design-services", "careers", "press", "stores", "track-order"];
  return [
    { url: canonical("/"), lastModified, changeFrequency: "daily", priority: 1 },
    ...categories.flatMap((category) => [
      { url: canonical(`/c/${category.slug}`), lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
      ...category.children.map((child) => ({
        url: canonical(`/c/${category.slug}/${child.slug}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ]),
    ...products.map((product) => ({
      url: canonical(`/p/${product.slug}`),
      lastModified: new Date(product.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...collections.map((slug) => ({ url: canonical(`/collections/${slug}`), lastModified, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...styles.map((slug) => ({ url: canonical(`/style/${slug}`), lastModified, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...Object.keys(colorHex).map((slug) => ({ url: canonical(`/color/${slug}`), lastModified, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...pages.map((slug) => ({ url: canonical(`/pages/${slug}`), lastModified, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
