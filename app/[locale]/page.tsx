import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ToolExplorer from "@/components/ToolExplorer";
import JsonLd from "@/components/JsonLd";
import { categories, tools } from "@/data/tools";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(params.locale);
  const t = await getTranslations("Home");
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: params.locale === "en" ? "/" : `/${params.locale}`,
      languages: {
        en: "https://freetoolsy.vercel.app/",
        tr: "https://freetoolsy.vercel.app/tr",
      },
    },
  };
}

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Home");
  const faqs = t.raw("faq") as Array<{ q: string; a: string }>;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FreetoolsY",
            url: "https://freetoolsy.vercel.app/",
            description: t("jsonldSiteDesc"),
            inLanguage: params.locale === "tr" ? "tr" : "en",
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FreetoolsY",
            url: "https://freetoolsy.vercel.app/",
            description: t("jsonldAppDesc"),
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            inLanguage: params.locale === "tr" ? "tr" : "en",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: params.locale === "tr" ? "TRY" : "USD",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          },
        ]}
      />
      <section className="pb-9 pt-14 sm:pb-10 sm:pt-20">
        <h1 className="max-w-[20ch] text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted">
          {t("heroSubtitle", { tools: tools.length, cats: categories.length })}
        </p>
      </section>

      <ToolExplorer />
    </main>
  );
}