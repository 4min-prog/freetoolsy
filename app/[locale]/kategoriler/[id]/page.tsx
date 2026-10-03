import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { categories } from "@/data/tools";
import { categoryPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categories.map((category) => ({ locale, id: category.id }))
  );
}

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function LegacyCategoryRedirect({
  params,
}: {
  params: { locale: string; id: string };
}) {
  permanentRedirect(categoryPath(params.locale as Locale, params.id));
}