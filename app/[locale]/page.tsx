import type { Metadata } from "next";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import ToolExplorer from "@/components/ToolExplorer";
import SearchBox from "@/components/SearchBox";
import JsonLd from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
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
  const trending = t.raw("trendingTools") as string[];
  const messages = (await getMessages()) as {
    ToolMeta?: Record<string, { name?: string }>;
  };
  const trendingLinks = trending
    .map((slug) => ({
      slug,
      name: messages.ToolMeta?.[slug]?.name ?? slug,
    }))
    .filter((item) => tools.some((tool) => tool.slug === item.slug));

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
      <section className="relative overflow-hidden pb-9 pt-14 sm:pb-10 sm:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="hero-bg absolute inset-0" />
          <div className="absolute -top-28 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
        </div>
        <h1 className="max-w-[22ch] text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
          {hasHighlight ? (
            <>
              {titleParts[0]}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                {heroHighlight}
              </span>
              {titleParts[1]}
            </>
          ) : (
            heroTitle
          )}
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted">
          {t("heroSubtitle", { tools: tools.length, cats: categories.length })}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-text">
              {tools.length}
            </span>
            <span className="text-sm text-muted">{t("statsTools")}</span>
          </div>
          <span aria-hidden="true" className="h-6 w-px bg-border" />
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-text">
              {categories.length}
            </span>
            <span className="text-sm text-muted">{t("statsCategories")}</span>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2">
          {trustBadges.map((key) => (
            <li
              key={key}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {t(key)}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-border bg-surface/80 p-2 shadow-card backdrop-blur">
          <SearchBox large placeholder={t("searchPlaceholder")} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-faint">
            {t("trendingLabel")}
          </span>
          {trendingLinks.map((item) => (
            <Link
              key={item.slug}
              href={`/araclar/${item.slug}`}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-text"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      <ToolExplorer />
    </main>
  );
}