import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ToolExplorer from "@/components/ToolExplorer";
import SearchBox from "@/components/SearchBox";
import PopularStrip from "@/components/PopularStrip";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";
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
        en: "https://freetoolsy.com/",
        tr: "https://freetoolsy.com/tr",
      },
    },
  };
}

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Home");
  const faqs = t.raw("faq") as Array<{ q: string; a: string }>;

  const heroTitle = t("heroTitle");
  const heroHighlight = t("heroTitleHighlight");
  const titleParts = heroTitle.split(heroHighlight);
  const hasHighlight = titleParts.length === 2;
  const trustBadges = ["trustBrowser", "trustFree", "trustPrivacy"];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FreetoolsY",
            url: "https://freetoolsy.com/",
            description: t("jsonldSiteDesc"),
            inLanguage: params.locale === "tr" ? "tr" : "en",
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FreetoolsY",
            url: "https://freetoolsy.com/",
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
      <section className="fade-in-up relative pb-9 pt-14 sm:pb-10 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="hero-bg absolute inset-0" />
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {tools.length} {t("statsTools")} / {categories.length}{" "}
            {t("statsCategories")}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>
        <h1 className="mt-6 max-w-[20ch] text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {hasHighlight ? (
            <>
              <span>
                {`${titleParts[0]}${heroHighlight}`.trim()}
              </span>
              {titleParts[1]?.trim() && (
                <span className="mt-2 block font-normal text-muted">
                  {titleParts[1].trim()}
                </span>
              )}
            </>
          ) : (
            heroTitle
          )}
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted">
          {t("heroSubtitle")}
        </p>

        <div className="relative z-30 mt-8">
          <SearchBox large placeholder={t("searchPlaceholder")} />
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
          {trustBadges.map((key) => (
            <li key={key} className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-3 w-3 text-accent"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <PopularStrip />

      <AdSlot slot="top" />

      <ToolExplorer />
    </main>
  );
}