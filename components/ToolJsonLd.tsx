import JsonLd from "./JsonLd";
import { getLocale, getTranslations } from "next-intl/server";
import { getTool } from "@/data/tools";
import { toolUrl } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";

export default async function ToolJsonLd({ slug }: { slug: string }) {
  const tool = getTool(slug);
  if (!tool) return null;

  const t = await getTranslations(`ToolMeta.${slug}`);
  const locale = (await getLocale()) as Locale;
  const isTr = locale === "tr";
  const url = toolUrl(locale, slug);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: t("name"),
        url,
        description: t("desc"),
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: isTr ? "TRY" : "USD",
        },
      }}
    />
  );
}