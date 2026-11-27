import { CatalogRoutePage, catalogMetadata, categoryParams, type CatalogSearchParams } from "@/components/catalog/CatalogRoutePage";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<CatalogSearchParams> };

export function generateStaticParams() { return categoryParams.map(({ category }) => ({ category })); }

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  return catalogMetadata({ kind: "category", slug: category });
}

export default async function Page({ params, searchParams }: Props) {
  const { category } = await params;
  return <CatalogRoutePage scope={{ kind: "category", slug: category }} searchParams={searchParams} />;
}
