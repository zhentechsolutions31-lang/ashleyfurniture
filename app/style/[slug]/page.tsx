import { CatalogRoutePage, catalogMetadata, styleParams, type CatalogSearchParams } from "@/components/catalog/CatalogRoutePage";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<CatalogSearchParams> };

export function generateStaticParams() { return styleParams; }
export async function generateMetadata({ params }: Props) { const { slug } = await params; return catalogMetadata({ kind: "style", slug }); }
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  return <CatalogRoutePage scope={{ kind: "style", slug }} searchParams={searchParams} />;
}
