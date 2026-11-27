import { CatalogRoutePage, catalogMetadata, colorParams, type CatalogSearchParams } from "@/components/catalog/CatalogRoutePage";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<CatalogSearchParams> };

export function generateStaticParams() { return colorParams; }
export async function generateMetadata({ params }: Props) { const { slug } = await params; return catalogMetadata({ kind: "color", slug }); }
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  return <CatalogRoutePage scope={{ kind: "color", slug }} searchParams={searchParams} />;
}
