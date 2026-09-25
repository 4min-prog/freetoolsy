import type { Metadata } from "next";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import ToolExplorer from "@/components/ToolExplorer";
import SearchBox from "@/components/SearchBox";
import PopularStrip from "@/components/PopularStrip";
import JsonLd from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { categories, tools } from "@/data/tools";
import { toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";

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
  const locale = params.locale as Locale;
  const t = await getTranslations("Home");
  const messages = await getMessages();
  const toolMeta = (messages as { ToolMeta?: Record<string, { name?: string }> })
    .ToolMeta;
  const faqs = t.raw("faq") as Array<{ q: string; a: string }>;

  const half = Math.ceil(tools.length / 2);
  const indexColumns = [tools.slice(0, half), tools.slice(half)];

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
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-12">
          <div>
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
          </div>
          <aside className="mt-12 hidden border-l border-border pl-6 lg:mt-2 lg:block">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                {t("statsTools")}
              </span>
              <span className="font-mono text-[11px] text-faint">
                {String(tools.length).padStart(3, "0")}
              </span>
            </div>
            <div className="hero-marquee-mask mt-4 flex h-[22rem] gap-5 overflow-hidden">
              {indexColumns.map((column, columnIndex) => (
                <ul
                  key={columnIndex}
                  className={
                    columnIndex === 0
                      ? "hero-marquee w-1/2 shrink-0 space-y-2.5"
                      : "hero-marquee-reverse w-1/2 shrink-0 space-y-2.5"
                  }
                >
                  {[...column, ...column].map((tool, index) => (
                    <li key={`${tool.slug}-${index}`}>
                      <Link
                        href={toolPath(locale, tool.slug)}
                        className="group flex items-baseline gap-2 font-mono text-xs text-muted transition-colors hover:text-foreground"
                      >
                        <span className="w-6 shrink-0 text-right text-[10px] text-faint">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate group-hover:underline">
                          {toolMeta?.[tool.slug]?.name ?? tool.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <PopularStrip />

      <ToolExplorer />
    </main>
  );
}