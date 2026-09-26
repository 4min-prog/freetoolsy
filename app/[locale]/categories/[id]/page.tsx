import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { categories } from "@/data/tools";
import { categoryPath } from "@/lib/paths";
import CategoryPage, {
  generateMetadata as buildCategoryMetadata,
} from "../../kategoriler/[id]/page";

export const dynamicParams = false;

export const revalidate = 86400;

export function generateStaticParams() {
  return categories.map((category) => ({ locale: "en", id: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  return buildCategoryMetadata({ params: { ...params, locale: "en" } });
}

export default async function CategoriesPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  if (params.locale === "tr") {
    permanentRedirect(categoryPath("tr", params.id));
  }
  return CategoryPage({ params: { ...params, locale: "en" } });
}
