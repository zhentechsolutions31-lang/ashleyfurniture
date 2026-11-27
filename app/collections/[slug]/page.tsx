import { CatalogRoutePage, catalogMetadata, collectionParams, type CatalogSearchParams } from "@/components/catalog/CatalogRoutePage";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<CatalogSearchParams> };

export function generateStaticParams() { return collectionParams; }
export async function generateMetadata({ params }: Props) { const { slug } = await params; return catalogMetadata({ kind: "collection", slug }); }
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  return <CatalogRoutePage scope={{ kind: "collection", slug }} searchParams={searchParams} />;
}
