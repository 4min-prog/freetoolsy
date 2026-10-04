import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  categories,
  displayToolCount,
  getTool,
  getToolsByCategory,
  tools,
  type Tool,
} from "@/data/tools";
import type { Locale } from "@/i18n/routing";
import { POPULAR_SLUGS } from "@/data/popular";
import {
  categoryPath,
  categoryUrl,
  localizedUrl,
  siteUrl,
  toolUrl,
} from "@/lib/paths";
import ToolCard from "@/components/ToolCard";
import CategoryIcon from "@/components/CategoryIcon";
import JsonLd from "@/components/JsonLd";
import { categoryTheme } from "@/components/categoryTheme";

export const dynamicParams = false;

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categories.map((category) => ({ locale, id: category.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const category = categories.find((item) => item.id === params.id);
  if (!category) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("CategoryPage");
  const tc = await getTranslations("Categories");
  const canonical = localizedUrl(locale, categoryPath(locale, category.id));
  const description = t(`desc.${category.id}`);
  const title =
    locale === "en"
      ? `100% Free ${tc(category.id)} Tools`
      : `%100 Ücretsiz ${tc(category.id)} Araçları`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: categoryUrl("en", category.id),
        tr: categoryUrl("tr", category.id),
      },
    },
    openGraph: {
      type: "website",
      siteName: "FreetoolsY",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      url: canonical,
      title,
      description,
      images: [
        {
          url: `${siteUrl}/og/${category.id}?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: `${tc(category.id)} ${locale === "en" ? "Tools" : "Araçları"}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/og/${category.id}?locale=${locale}`],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const category = categories.find((item) => item.id === params.id);
  if (!category) notFound();

  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("CategoryPage");
  const tc = await getTranslations("Categories");
  const tInfo = await getTranslations("Info");
  const messages = await getMessages();
  const theme = categoryTheme(category.id);
  const categoryTools = getToolsByCategory(category.id);
  const popularTools = POPULAR_SLUGS.map((slug) => getTool(slug)).filter(
    (tool): tool is Tool => tool !== undefined && tool.category === category.id
  );
  const featuredTools = [
    ...popularTools,
    ...categoryTools.filter(
      (tool) => !popularTools.some((popularTool) => popularTool.slug === tool.slug)
    ),
  ].slice(0, 3);
  const seoContent = t.raw(`seoContent.${category.id}`) as {
    description: string;
    useCases: string[];
    faq: { question: string; answer: string }[];
  };
  const toolMeta = (
    messages as {
      ToolMeta?: Record<string, { name?: string }>;
    }
  ).ToolMeta;
  const related = categories.filter((item) => item.id !== category.id);

  const homeUrl = localizedUrl(locale, "/");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: tInfo("breadcrumbHome"),
                item: homeUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t("breadcrumbAll"),
                item: `${homeUrl}#tools-explorer`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: tc(category.id),
                item: categoryUrl(locale, category.id),
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name:
              locale === "tr"
                ? `${tc(category.id)} Araçları`
                : `${tc(category.id)} Tools`,
            url: categoryUrl(locale, category.id),
            inLanguage: locale,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: categoryTools.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: toolMeta?.[tool.slug]?.name ?? tool.name,
                url: toolUrl(locale, tool.slug),
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: seoContent.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          },
        ]}
      />

      <nav
        aria-label={t("breadcrumbAria")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text">
          {tInfo("breadcrumbHome")}
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">{tc(category.id)}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          aria-hidden="true"
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${theme.iconBg}`}
        >
          <CategoryIcon id={category.id} className={`h-6 w-6 ${theme.iconText}`} />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {tc(category.id)}
        </h1>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        {seoContent.description}
      </p>

      <section
        aria-labelledby="popular-tools-title"
        className="mt-8"
      >
        <h2
          id="popular-tools-title"
          className="text-lg font-semibold tracking-tight text-text"
        >
          {t("mostPopularTitle")}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="use-cases-title"
        className="mt-10 rounded-xl border border-border bg-surface p-6 shadow-card"
      >
        <h2
          id="use-cases-title"
          className="text-lg font-semibold tracking-tight text-text"
        >
          {t("useCasesTitle")}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {seoContent.useCases.map((useCase) => (
            <li
              key={useCase}
              className="rounded-lg border border-border bg-bg p-4 text-sm leading-relaxed text-muted"
            >
              {useCase}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="all-category-tools-title" className="mt-10">
        <h2
          id="all-category-tools-title"
          className="text-lg font-semibold tracking-tight text-text"
        >
          {t("allToolsTitle", { category: tc(category.id) })}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="category-faq-title"
        className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-card"
      >
        <h2
          id="category-faq-title"
          className="text-lg font-semibold tracking-tight text-text"
        >
          {t("faqTitle")}
        </h2>
        <ul className="mt-4 space-y-3">
          {seoContent.faq.map((item) => (
            <li
              key={item.question}
              className="rounded-lg border border-border bg-bg px-4 py-3"
            >
              <h3 className="text-sm font-medium text-text">
                {item.question}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-label={t("relatedTitle")}
        className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-card"
      >
        <h2 className="text-base font-semibold tracking-tight text-text">
          {t("relatedTitle")}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {related.map((item) => {
            const itemTheme = categoryTheme(item.id);
            return (
              <Link
                key={item.id}
                href={categoryPath(locale, item.id)}
                className={`flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-muted transition-colors ${itemTheme.hoverBorder}`}
              >
                <CategoryIcon
                  id={item.id}
                  className={`h-4 w-4 ${itemTheme.iconText}`}
                />
                {tc(item.id)}
              </Link>
            );
          })}
        </div>
      </section>

      <Link
        href="/"
        className="btn-accent mt-10 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("ctaAllTools", { count: displayToolCount(tools.length) })}
      </Link>
    </main>
  );
}