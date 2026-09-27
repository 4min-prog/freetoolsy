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
import RotatingWords from "@/components/RotatingWords";
import { Link } from "@/i18n/navigation";
import { displayToolCount, tools } from "@/data/tools";
import { categoryTheme } from "@/components/categoryTheme";
import { toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

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
        en: "https://www.freetoolsy.com/",
        tr: "https://www.freetoolsy.com/tr",
      },
    },
    openGraph: {
      type: "website",
      url: "https://www.freetoolsy.com/",
      siteName: "FreetoolsY",
      locale: params.locale === "tr" ? "tr_TR" : "en_US",
      images: [
        {
          url: "https://www.freetoolsy.com/og/home",
          width: 1200,
          height: 630,
          alt: "FreetoolsY — Free Tools for Everyday Tasks",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["https://www.freetoolsy.com/og/home"],
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
  const categoryNames = (messages as { Categories?: Record<string, string> })
    .Categories;
  const heroWords = ["text", "developer", "security", "calculation", "image", "seo", "fun"]
    .map((id) => ({
      text: categoryNames?.[id] ?? id,
      color: categoryTheme(id).iconText,
    }));

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FreetoolsY",
            url: "https://www.freetoolsy.com/",
            description: t("jsonldSiteDesc"),
            inLanguage: params.locale === "tr" ? "tr" : "en",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://www.freetoolsy.com/?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FreetoolsY",
            url: "https://www.freetoolsy.com/",
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
      <section className="fade-in-up relative pb-9 pt-10 sm:pb-10 sm:pt-20">
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
                {displayToolCount(tools.length)} {t("statsTools")}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
            <h1 className="mt-6 max-w-[20ch] text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {hasHighlight ? (
            <>
              <span>
                {`${titleParts[0]}${heroHighlight}`.trim()}
              </span>
              {titleParts[1]?.trim() && (
                <span className="mt-2 block font-normal text-muted">
                  {t("heroTitleFor")}{" "}
                  {heroWords.length > 0 ? (
                    <RotatingWords words={heroWords} />
                  ) : (
                    titleParts[1].trim()
                  )}
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
          </div>
          <aside className="mt-12 hidden border-l border-border pl-6 lg:mt-2 lg:block">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                {t("statsTools")}
              </span>
              <span className="font-mono text-[11px] text-faint">
                {displayToolCount(tools.length)}
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

      <section aria-label={t("valueLabel")} className="border-y border-border bg-surface">
        <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {[
            {
              label: t("valueNoSignup.label"),
              desc: t("valueNoSignup.desc"),
              icon: (
                <>
                  <circle cx="12" cy="7.5" r="4" />
                  <path d="M4 20c0-4.5 3.6-7 8-7s8 2.5 8 7" />
                </>
              ),
            },
            {
              label: t("valueFast.label"),
              desc: t("valueFast.desc"),
              icon: (
                <>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </>
              ),
            },
            {
              label: t("valuePrivate.label"),
              desc: t("valuePrivate.desc"),
              icon: (
                <>
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </>
              ),
            },
            {
              label: t("valueFree.label"),
              desc: t("valueFree.desc"),
              icon: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
            },
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 bg-surface p-4 sm:p-5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-accent"
              >
                {item.icon}
              </svg>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight text-text">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">
                  {item.desc}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <PopularStrip />

      <ToolExplorer />
    </main>
  );
}