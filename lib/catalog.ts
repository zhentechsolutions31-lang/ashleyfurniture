import categoriesData from "@/src/data/categories.json";
import productsData from "@/src/data/products.json";
import type { Category, Product } from "./types";

export const categories = categoriesData as Category[];
export const products = productsData as Product[];

export function getProduct(slugOrId: string) {
  return products.find((product) => product.slug === slugOrId || product.id === slugOrId);
}

export function findCategory(slug: string) {
  for (const category of categories) {
    if (category.slug === slug) return { category, child: undefined };
    const child = category.children.find((item) => item.slug === slug);
    if (child) return { category, child };
  }
  return undefined;
}

export function productsInCategory(slug: string) {
  const match = findCategory(slug);
  if (!match) return [];
  if (match.child) return products.filter((product) => product.category === match.child?.slug);
  return products.filter((product) => product.categoryPath[0] === match.category.slug);
}

export function relatedProducts(product: Product, limit = 8) {
  return products
    .filter((candidate) => candidate.id !== product.id && candidate.categoryPath[0] === product.categoryPath[0])
    .sort((a, b) =>
      Math.abs(a.price - product.price) - Math.abs(b.price - product.price),
    )
    .slice(0, limit);
}

export const styles = [
  "modern", "contemporary", "traditional", "transitional", "farmhouse", "coastal", "mid-century",
];

export const colorHex: Record<string, string> = {
  gray: "#8D918E", tan: "#C7A77D", white: "#FFFFFF", brown: "#795548",
  blue: "#5B7185", ivory: "#EFE8D7", green: "#55745F", black: "#282828",
  sand: "#D7C3A5", walnut: "#654231", natural: "#D5C4A6", terracotta: "#B9684A",
};

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    let parsed: URL;
    try {
      parsed = new URL(configured);
    } catch {
      throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute HTTP or HTTPS URL.");
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.");
    }
    return parsed.origin;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required for production builds and servers.");
  }
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
