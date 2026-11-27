import { applyFilters, applySort, activeFilterLabels, getFacetCounts } from "@/lib/filters";
import { searchCategories, searchProducts } from "@/lib/search";
import type { Category, Product } from "@/lib/types";

const make = (id: string, overrides: Partial<Product> = {}): Product => ({
  id, slug: `${id}-product`, title: `${id} Modern Sofa`, brand: "Haven & Oak", category: "sofas", categoryPath: ["living-room", "sofas"], styles: ["modern"], colors: ["gray"], materials: ["solid-wood"], features: ["storage"], badges: [], price: 50000, rating: 4.2, reviewCount: 20, inStock: true, createdAt: "2026-01-01", shortFeatures: ["Soft cushions"], description: "Original description.", images: [{ src: "/x.svg", alt: "Sofa" }], ...overrides,
});
const products = [
  make("A", { title: "Arlo Modern Sofa", price: 50000, originalPrice: 70000 }),
  make("B", { title: "Birch Farmhouse Bed", category: "beds", categoryPath: ["bedroom", "beds"], styles: ["farmhouse"], colors: ["brown"], materials: ["wood"], features: [], price: 100000, rating: 4.8, createdAt: "2026-08-01" }),
  make("C", { title: "Cove Coastal Sofa", styles: ["coastal"], colors: ["blue"], inStock: false, price: 150000, originalPrice: 180000 }),
];

describe("filters and sorting", () => {
  it("filters by style, colour, material and stock", () => {
    expect(applyFilters(products, "style=modern&color=gray&material=solid-wood&availability=in-stock").map((p) => p.id)).toEqual(["A"]);
    expect(applyFilters(products, "style=farmhouse").map((p) => p.id)).toEqual(["B"]);
  });
  it("filters by price, sale and rating", () => {
    expect(applyFilters(products, "price=60000-160000").map((p) => p.id)).toEqual(["B", "C"]);
    expect(applyFilters(products, "sale=true").map((p) => p.id)).toEqual(["A", "C"]);
    expect(applyFilters(products, "rating=4.5").map((p) => p.id)).toEqual(["B"]);
  });
  it("sorts by price, newest, rating and savings", () => {
    expect(applySort(products, "price-asc").map((p) => p.id)).toEqual(["A", "B", "C"]);
    expect(applySort(products, "price-desc")[0].id).toBe("C");
    expect(applySort(products, "newest")[0].id).toBe("B");
    expect(applySort(products, "rating")[0].id).toBe("B");
    expect(applySort(products, "savings")[0].id).toBe("C");
  });
  it("provides facet counts and active labels", () => {
    expect(getFacetCounts(products).style.modern).toBe(1);
    expect(activeFilterLabels(new URLSearchParams("style=modern,coastal&sale=true"))).toHaveLength(3);
    expect(activeFilterLabels(new URLSearchParams("price=60000-160000"))[0].label).toBe("Price: $600.00 – $1,600.00");
  });
});

describe("search", () => {
  it("matches titles and descriptive terms", () => {
    expect(searchProducts(products, "Arlo").map((p) => p.id)).toEqual(["A"]);
    expect(searchProducts(products, "farmhouse").map((p) => p.id)).toEqual(["B"]);
    expect(searchProducts(products, "no-such-thing")).toEqual([]);
  });
  it("searches category names and children", () => {
    const categories: Category[] = [{ slug: "living-room", name: "Living Room", image: "/x.svg", description: "", children: [{ slug: "sofas", name: "Sofas" }] }];
    expect(searchCategories(categories, "sofa")).toHaveLength(1);
  });
});
