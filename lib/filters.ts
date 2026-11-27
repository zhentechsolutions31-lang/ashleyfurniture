import { formatPrice } from "./money";
import type { Product } from "./types";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating"
  | "savings";

type Params = URLSearchParams | string;

const toParams = (params: Params) =>
  typeof params === "string" ? new URLSearchParams(params) : params;

const list = (params: URLSearchParams, key: string) =>
  (params.get(key) ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);

export function applyFilters(products: Product[], input: Params): Product[] {
  const params = toParams(input);
  const styles = list(params, "style");
  const colors = list(params, "color");
  const materials = list(params, "material");
  const features = list(params, "feature");
  const sizes = list(params, "size");
  const rating = Number(params.get("rating") ?? 0);
  const inStock = params.get("availability") === "in-stock";
  const onSale = params.get("sale") === "true";
  const price = (params.get("price") ?? "").split("-");
  const min = price[0] === "" || price[0] === undefined ? 0 : Number(price[0]);
  const max = price[1] === "" || price[1] === undefined ? Number.POSITIVE_INFINITY : Number(price[1]);

  return products.filter((product) => {
    if (Number.isFinite(min) && product.price < min) return false;
    if (Number.isFinite(max) && product.price > max) return false;
    if (styles.length && !styles.some((style) => product.styles.includes(style))) return false;
    if (colors.length && !colors.some((color) => product.colors.includes(color))) return false;
    if (materials.length && !materials.some((material) => product.materials.includes(material))) return false;
    if (features.length && !features.every((feature) => product.features.includes(feature))) return false;
    if (sizes.length && !sizes.some((size) =>
      product.category.includes(size) || product.dimensions?.width === Number(size),
    )) return false;
    if (inStock && !product.inStock) return false;
    if (onSale && !product.originalPrice) return false;
    if (rating && product.rating < rating) return false;
    return true;
  });
}

export function applySort(products: Product[], sort = "featured"): Product[] {
  const result = [...products];
  switch (sort) {
    case "price-asc": return result.sort((a, b) => a.price - b.price);
    case "price-desc": return result.sort((a, b) => b.price - a.price);
    case "newest": return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "rating": return result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "savings":
      return result.sort((a, b) =>
        (b.originalPrice ?? b.price) - b.price - ((a.originalPrice ?? a.price) - a.price),
      );
    default:
      return result.sort((a, b) =>
        Number(b.badges.includes("best-seller")) - Number(a.badges.includes("best-seller")) ||
        b.rating - a.rating,
      );
  }
}

export type FacetCounts = Record<string, Record<string, number>>;

export function getFacetCounts(products: Product[]): FacetCounts {
  const counts: FacetCounts = {
    style: {}, color: {}, material: {}, feature: {}, size: {},
  };
  const add = (group: keyof FacetCounts, value: string) => {
    counts[group][value] = (counts[group][value] ?? 0) + 1;
  };
  products.forEach((product) => {
    product.styles.forEach((value) => add("style", value));
    product.colors.forEach((value) => add("color", value));
    product.materials.forEach((value) => add("material", value));
    product.features.forEach((value) => add("feature", value));
    if (product.dimensions) add("size", String(product.dimensions.width));
    add("size", product.category);
  });
  return counts;
}

export function hasActiveFilters(params: URLSearchParams) {
  return ["price", "style", "color", "material", "feature", "size", "availability", "rating", "sale"]
    .some((key) => params.has(key));
}

export function activeFilterLabels(params: URLSearchParams): { key: string; label: string }[] {
  const labels: { key: string; label: string }[] = [];
  const names: Record<string, string> = {
    style: "Style", color: "Colour", material: "Material", feature: "Feature", size: "Size",
  };
  Object.entries(names).forEach(([key, name]) => {
    list(params, key).forEach((value) => labels.push({ key, label: `${name}: ${titleCase(value)}` }));
  });
  const price = params.get("price");
  if (price) {
    const [minText, maxText] = price.split("-");
    const min = Number(minText || 0);
    const max = maxText ? Number(maxText) : null;
    const range = max === null
      ? `${formatPrice(min)} and up`
      : min === 0
        ? `Up to ${formatPrice(max)}`
        : `${formatPrice(min)} – ${formatPrice(max)}`;
    labels.push({ key: "price", label: `Price: ${range}` });
  }
  if (params.get("availability")) labels.push({ key: "availability", label: "In stock" });
  if (params.get("rating")) labels.push({ key: "rating", label: `${params.get("rating")}★ & up` });
  if (params.get("sale") === "true") labels.push({ key: "sale", label: "On sale" });
  return labels;
}

export function titleCase(value: string) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
