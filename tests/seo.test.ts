import type { Metadata } from "next";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { categories, colorHex, products, styles } from "@/lib/catalog";
import {
  brandedTitle,
  getCatalogSeo,
  homeMetadata,
  homeSeo,
  keywordsFor,
  productSeo,
  siteMetadata,
  staticPageSeo,
  utilityMetadata,
} from "@/lib/seo";
import type { SeoCopy, UtilityPageKey } from "@/lib/seo";

const originalDemo = process.env.NEXT_PUBLIC_SITE_DEMO;

afterEach(() => {
  if (originalDemo === undefined) delete process.env.NEXT_PUBLIC_SITE_DEMO;
  else process.env.NEXT_PUBLIC_SITE_DEMO = originalDemo;
});

function normalizeMatch(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titleFrom(metadata: Metadata): string {
  if (typeof metadata.title === "string") return metadata.title;
  if (metadata.title && "default" in metadata.title) return metadata.title.default;
  return metadata.title?.absolute ?? "";
}

function expectSeoCopy(seo: SeoCopy) {
  const title = brandedTitle(seo.title);
  expect(title.length, `${seo.title} title length`).toBeLessThanOrEqual(60);
  expect(seo.description.length, `${seo.title} description length`).toBeGreaterThanOrEqual(120);
  expect(seo.description.length, `${seo.title} description length`).toBeLessThanOrEqual(160);
  expect(normalizeMatch(title), `${seo.title} title focus keyword`).toContain(normalizeMatch(seo.focusKeyword));
  expect(normalizeMatch(seo.description), `${seo.title} description focus keyword`).toContain(normalizeMatch(seo.focusKeyword));
  expect(keywordsFor(seo)[0]).toBe(seo.focusKeyword);
}

const collectionSlugs = ["deals", "digital-deals", "designer-picks", "best-sellers", "new-arrivals", "spring-refresh", "cozy-furniture"];

const catalogSeo = [
  ...categories.flatMap((category) => [
    getCatalogSeo({ kind: "category", slug: category.slug }),
    ...category.children.map((child) => getCatalogSeo({ kind: "category", slug: category.slug, subcategory: child.slug })),
  ]),
  ...collectionSlugs.map((slug) => getCatalogSeo({ kind: "collection", slug })),
  ...styles.map((slug) => getCatalogSeo({ kind: "style", slug })),
  ...Object.keys(colorHex).map((slug) => getCatalogSeo({ kind: "color", slug })),
].filter((seo): seo is SeoCopy => Boolean(seo));

describe("page SEO copy", () => {
  it("optimizes every category, subcategory, collection, style and colour", () => {
    expect(catalogSeo).toHaveLength(categories.length + categories.reduce((total, category) => total + category.children.length, 0) + collectionSlugs.length + styles.length + Object.keys(colorHex).length);
    catalogSeo.forEach(expectSeoCopy);
    expect(new Set(catalogSeo.map((seo) => seo.title)).size).toBe(catalogSeo.length);
    expect(new Set(catalogSeo.map((seo) => seo.description)).size).toBe(catalogSeo.length);
  });

  it("uses the child focus keyword for direct subcategory aliases", () => {
    expect(getCatalogSeo({ kind: "category", slug: "sofas" })?.focusKeyword).toBe("sofas and couches");
    expect(getCatalogSeo({ kind: "category", slug: "storage" })?.focusKeyword).toBe("home storage and organization");
  });

  it("optimizes the informational and policy pages", () => {
    const pages = Object.values(staticPageSeo);
    expect(pages).toHaveLength(14);
    pages.forEach(expectSeoCopy);
    expect(new Set(pages.map((seo) => seo.description)).size).toBe(pages.length);
  });

  it("creates unique product metadata from each product's name and features", () => {
    const copies = products.map(productSeo);
    copies.forEach(expectSeoCopy);
    expect(new Set(copies.map((seo) => seo.title)).size).toBe(products.length);
    expect(new Set(copies.map((seo) => seo.description)).size).toBe(products.length);
    copies.forEach((seo) => expect(seo.description.endsWith("…")).toBe(false));
  });

  it("optimizes utility metadata while preserving noindex behavior", () => {
    const keys: UtilityPageKey[] = ["search", "cart", "checkout", "order", "wishlist", "not-found", "product-not-found", "collection-not-found", "page-not-found"];
    keys.forEach((key) => {
      const metadata = utilityMetadata(key);
      const title = titleFrom(metadata);
      const description = metadata.description ?? "";
      const keywords = metadata.keywords ?? [];
      const focus = String(keywords[0]);
      expect(title.length, `${key} title length`).toBeLessThanOrEqual(60);
      expect(description.length, `${key} description length`).toBeGreaterThanOrEqual(120);
      expect(description.length, `${key} description length`).toBeLessThanOrEqual(160);
      expect(normalizeMatch(title), `${key} title focus keyword`).toContain(normalizeMatch(focus));
      expect(normalizeMatch(description), `${key} description focus keyword`).toContain(normalizeMatch(focus));
      expect(metadata.robots).toEqual({ index: false, follow: false });
    });
  });

  it("keeps the brand homepage aligned with its search intent", () => {
    expectSeoCopy(homeSeo);
    expect(titleFrom(homeMetadata)).toBe(brandedTitle(homeSeo.title));
    expect(homeMetadata.description).toBe(homeSeo.description);
    expect(homeSeo.focusKeyword).toBe("Ashley Furniture");
    expect(homeMetadata.keywords?.[0]).toBe("Ashley Furniture");
    expect(homeSeo.description).toContain("Ashley Furniture");
    expect(homeMetadata.alternates?.canonical).toBe("/");
  });

  it("keeps root metadata concise and branded", () => {
    expect(titleFrom(siteMetadata)).toBe("Ashley Furniture | Affordable Home Furniture & Decor");
    expect(siteMetadata.title).toEqual({ default: "Ashley Furniture | Affordable Home Furniture & Decor", template: "%s" });
    expect(siteMetadata.keywords?.[0]).toBe("Ashley Furniture");
    expect(siteMetadata.description?.length).toBeLessThanOrEqual(160);
  });
});

describe("crawler metadata", () => {
  it("includes every public page, category, product, collection, style, colour and static page in the sitemap", () => {
    delete process.env.NEXT_PUBLIC_SITE_DEMO;
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://ashleyfurniture.site/");
    categories.forEach((category) => {
      expect(urls).toContain(`https://ashleyfurniture.site/c/${category.slug}`);
      category.children.forEach((child) => {
        expect(urls).toContain(`https://ashleyfurniture.site/c/${category.slug}/${child.slug}`);
      });
    });
    products.forEach((product) => {
      expect(urls).toContain(`https://ashleyfurniture.site/p/${product.slug}`);
    });
    collectionSlugs.forEach((slug) => {
      expect(urls).toContain(`https://ashleyfurniture.site/collections/${slug}`);
    });
    styles.forEach((slug) => {
      expect(urls).toContain(`https://ashleyfurniture.site/style/${slug}`);
    });
    Object.keys(colorHex).forEach((color) => {
      expect(urls).toContain(`https://ashleyfurniture.site/color/${color}`);
    });
    Object.keys(staticPageSeo).forEach((slug) => {
      expect(urls).toContain(`https://ashleyfurniture.site/pages/${slug}`);
    });
    expect(robots().sitemap).toBe("https://ashleyfurniture.site/sitemap.xml");
  });

  it("allows disabling indexing via NEXT_PUBLIC_SITE_DEMO=true", () => {
    process.env.NEXT_PUBLIC_SITE_DEMO = "true";
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});
