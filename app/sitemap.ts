import type { MetadataRoute } from "next";
import { categories, colorHex, products, styles } from "@/lib/catalog";
import { canonical } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_SITE_DEMO !== "false") return [];
  const lastModified = new Date("2026-11-26");
  const collections = ["deals", "digital-deals", "designer-picks", "best-sellers", "new-arrivals", "spring-refresh", "cozy-furniture"];
  const pages = ["about", "contact", "faq", "shipping", "returns", "privacy", "terms", "accessibility", "financing", "design-services", "careers", "press", "stores"];
  return [
    { url: canonical("/"), lastModified },
    ...categories.flatMap((category) => [{ url: canonical(`/c/${category.slug}`), lastModified }, ...category.children.map((child) => ({ url: canonical(`/c/${category.slug}/${child.slug}`), lastModified }))]),
    ...products.map((product) => ({ url: canonical(`/p/${product.slug}`), lastModified: new Date(product.createdAt) })),
    ...collections.map((slug) => ({ url: canonical(`/collections/${slug}`), lastModified })),
    ...styles.map((slug) => ({ url: canonical(`/style/${slug}`), lastModified })),
    ...Object.keys(colorHex).map((slug) => ({ url: canonical(`/color/${slug}`), lastModified })),
    ...pages.map((slug) => ({ url: canonical(`/pages/${slug}`), lastModified })),
  ];
}
