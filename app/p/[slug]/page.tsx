import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { brandedTitle, canonical, keywordsFor, metadataTitle, productSeo, utilityMetadata } from "@/lib/seo";
import { getProduct, products, SITE_URL } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return utilityMetadata("product-not-found");
  const seo = productSeo(product);
  return {
    title: metadataTitle(seo.title),
    description: seo.description,
    keywords: keywordsFor(seo),
    alternates: { canonical: `/p/${product.slug}` },
    openGraph: { type: "website", title: brandedTitle(seo.title), description: seo.description, images: [{ url: product.images[0]?.src ?? "/images/photos/og-image.jpg", width: 1200, height: 900, alt: product.images[0]?.alt ?? product.title }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((image) => `${SITE_URL}${image.src}`),
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: canonical(`/p/${product.slug}`),
      priceCurrency: "USD",
      price: (product.price / 100).toFixed(2),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
      { "@type": "ListItem", position: 2, name: product.categoryPath[0].replace(/-/g, " "), item: canonical(`/c/${product.categoryPath[0]}`) },
      { "@type": "ListItem", position: 3, name: product.title, item: canonical(`/p/${product.slug}`) },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><ProductDetail product={product} /></>;
}
