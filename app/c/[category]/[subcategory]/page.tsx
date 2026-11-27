import { CatalogRoutePage, catalogMetadata, categoryParams, type CatalogSearchParams } from "@/components/catalog/CatalogRoutePage";

type Props = { params: Promise<{ category: string; subcategory: string }>; searchParams: Promise<CatalogSearchParams> };

export function generateStaticParams() { return categoryParams.filter((item) => "subcategory" in item).map(({ category, subcategory }) => ({ category, subcategory })); }

export async function generateMetadata({ params }: Props) {
  const { category, subcategory } = await params;
  return catalogMetadata({ kind: "category", slug: category, subcategory });
}

export default async function Page({ params, searchParams }: Props) {
  const { category, subcategory } = await params;
  return <CatalogRoutePage scope={{ kind: "category", slug: category, subcategory }} searchParams={searchParams} />;
}
