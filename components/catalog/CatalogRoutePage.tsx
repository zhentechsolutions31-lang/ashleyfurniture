import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/listing/CatalogView";
import { canonical } from "@/lib/seo";
import { categories, colorHex, findCategory, products, productsInCategory, styles } from "@/lib/catalog";
import { titleCase } from "@/lib/filters";

export type CatalogScope =
  | { kind: "category"; slug: string; subcategory?: string }
  | { kind: "collection" | "style" | "color"; slug: string };

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

const collectionInfo: Record<string, { title: string; description: string; image: string }> = {
  deals: { title: "Deals of the Week", description: "Thoughtful furniture at refreshing prices. Discover limited-time savings across every room.", image: "/images/photos/promos/deals.webp" },
  "digital-deals": { title: "Digital Deals", description: "Online-only value on accents, décor and everyday essentials.", image: "/images/photos/categories/rugs-decor.webp" },
  "designer-picks": { title: "Designer Picks", description: "Distinctive details and elevated materials, selected for a considered home.", image: "/images/photos/rooms/dining-room.webp" },
  "best-sellers": { title: "Best Sellers", description: "Our most-loved pieces, chosen again and again for comfort, quality and timeless style.", image: "/images/photos/categories/living-room.webp" },
  "new-arrivals": { title: "New Arrivals", description: "Fresh silhouettes, warm finishes and new ways to make your space your own.", image: "/images/photos/promos/new-arrivals.webp" },
  "spring-refresh": { title: "Spring Refresh", description: "Light layers, natural tones and easy updates for a brighter season at home.", image: "/images/photos/rooms/outdoor.webp" },
  "cozy-furniture": { title: "Cozy Furniture", description: "Soft textures, inviting comfort and pieces made for unhurried evenings.", image: "/images/photos/rooms/bedroom.webp" },
};

function resolve(scope: CatalogScope) {
  if (scope.kind === "category") {
    const directCategory = categories.find((category) => category.slug === scope.slug);
    const alias = !directCategory && !scope.subcategory ? findCategory(scope.slug) : undefined;
    const category = directCategory ?? alias?.category;
    const child = directCategory
      ? scope.subcategory ? directCategory.children.find((item) => item.slug === scope.subcategory) : undefined
      : alias?.child;
    if (!category || (scope.subcategory && !child)) return undefined;
    const list = child
      ? products.filter((product) => product.categoryPath[0] === category.slug && product.category === child.slug)
      : productsInCategory(category.slug);
    return {
      title: child?.name ?? category.name,
      description: child ? `Explore ${child.name.toLowerCase()} selected for comfort, quality and everyday living.` : category.description,
      image: category.image,
      products: list,
      categorySlug: category.slug,
      breadcrumbs: [{ label: category.name, href: `/c/${category.slug}` }, ...(child ? [{ label: child.name }] : [])],
      path: child ? `/c/${category.slug}/${child.slug}` : `/c/${category.slug}`,
    };
  }
  if (scope.kind === "collection") {
    const info = collectionInfo[scope.slug];
    if (!info) return undefined;
    const list = products.filter((product) => {
      if (scope.slug === "deals") return !!product.originalPrice;
      if (scope.slug === "digital-deals") return product.price < 50000;
      if (scope.slug === "designer-picks") return product.badges.includes("luxe");
      if (scope.slug === "best-sellers") return product.badges.includes("best-seller");
      if (scope.slug === "new-arrivals") return product.createdAt >= "2026-06-01";
      if (scope.slug === "spring-refresh") return product.colors.some((color) => ["green", "ivory", "white", "sand"].includes(color));
      return product.categoryPath[0] === "living-room" || product.categoryPath[0] === "bedroom";
    });
    return { ...info, products: list, breadcrumbs: [{ label: "Collections", href: "/collections/deals" }, { label: info.title }], path: `/collections/${scope.slug}` };
  }
  if (scope.kind === "style") {
    if (!styles.includes(scope.slug)) return undefined;
    return { title: `${titleCase(scope.slug)} Furniture`, description: `Clean lines and considered details define our ${scope.slug.replace("-", " ")} furniture collection.`, image: "/images/photos/rooms/living-room.webp", products: products.filter((product) => product.styles.includes(scope.slug)), breadcrumbs: [{ label: "Shop by Style", href: "/style/modern" }, { label: titleCase(scope.slug) }], path: `/style/${scope.slug}` };
  }
  if (!colorHex[scope.slug]) return undefined;
  return { title: `${titleCase(scope.slug)} Furniture`, description: `Warm, versatile ${scope.slug} pieces that bring calm cohesion to your home.`, image: "/images/photos/categories/living-room.webp", products: products.filter((product) => product.colors.includes(scope.slug)), breadcrumbs: [{ label: "Shop by Colour", href: "/color/gray" }, { label: titleCase(scope.slug) }], path: `/color/${scope.slug}` };
}

export async function CatalogRoutePage({ scope, searchParams }: { scope: CatalogScope; searchParams?: Promise<CatalogSearchParams> }) {
  const result = resolve(scope);
  if (!result) notFound();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const queryParams = new URLSearchParams();
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value !== undefined) queryParams.set(key, Array.isArray(value) ? value.join(",") : value);
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", item: canonical("/") }, ...result.breadcrumbs.filter((item) => item.href).map((item, index) => ({ "@type": "ListItem", position: index + 2, name: item.label, item: canonical(item.href!) }))],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CatalogView title={result.title} description={result.description} image={result.image} products={result.products} breadcrumbs={result.breadcrumbs} categorySlug={result.categorySlug} query={queryParams.toString()} />
    </>
  );
}

export async function catalogMetadata(scope: CatalogScope): Promise<Metadata> {
  const result = resolve(scope);
  if (!result) return { title: "Collection not found", robots: { index: false, follow: false } };
  return {
    title: `${result.title} – Shop ${result.products.length}+ Styles`,
    description: result.description,
    alternates: { canonical: result.path },
    openGraph: { title: result.title, description: result.description, images: [{ url: result.image, width: 1200, height: 630, alt: result.title }] },
  };
}

export const categoryParams = categories.flatMap((category) => [
  { category: category.slug },
  ...category.children.map((child) => ({ category: category.slug, subcategory: child.slug })),
  ...category.children.map((child) => ({ category: child.slug })),
]);
export const collectionParams = Object.keys(collectionInfo).map((slug) => ({ slug }));
export const styleParams = styles.map((slug) => ({ slug }));
export const colorParams = Object.keys(colorHex).map((slug) => ({ slug }));
