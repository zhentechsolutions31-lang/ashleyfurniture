import type { Category, Product } from "./types";

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function searchProducts(products: Product[], query: string): Product[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (!terms.length) return [];
  return products
    .map((product) => {
      const title = normalize(product.title);
      const haystack = normalize([
        product.title, product.category, ...product.styles, ...product.colors,
        ...product.materials, ...product.features, ...product.shortFeatures,
      ].join(" "));
      let score = 0;
      terms.forEach((term) => {
        if (title === term) score += 100;
        else if (title.startsWith(term)) score += 40;
        else if (title.includes(term)) score += 25;
        else if (haystack.includes(term)) score += 10;
        else if (Array.from(term).some((_, index) => haystack.includes(term.slice(0, index + 1)) && index > 2)) score += 1;
      });
      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .map(({ product }) => product);
}

export function searchCategories(categories: Category[], query: string): Category[] {
  const normalized = normalize(query);
  if (!normalized) return [];
  return categories.filter((category) =>
    normalize([category.name, ...category.children.map((child) => child.name)].join(" ")).includes(normalized),
  );
}
