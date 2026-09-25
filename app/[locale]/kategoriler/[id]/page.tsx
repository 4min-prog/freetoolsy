import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, getToolsByCategory, tools } from "@/data/tools";
import type { Locale } from "@/i18n/routing";
import {
  categoryPath,
  categoryUrl,
  localizedUrl,
  toolUrl,
} from "@/lib/paths";
import ToolCard from "@/components/ToolCard";
import CategoryIcon from "@/components/CategoryIcon";
import JsonLd from "@/components/JsonLd";
import { categoryTheme } from "@/components/categoryTheme";


export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ locale: "tr", id: category.id }));
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
  return {
    title: `${tc(category.id)} ${locale === "en" ? "Tools" : "Araçları"} – FreetoolsY`,
    description: t(`desc.${category.id}`),
    alternates: {
      canonical: localizedUrl(locale, categoryPath(locale, category.id)),
      languages: {
        en: categoryUrl("en", category.id),
        tr: categoryUrl("tr", category.id),
      },
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
  const theme = categoryTheme(category.id);
  const categoryTools = getToolsByCategory(category.id);
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
            name: `${tc(category.id)} tools`,
            url: categoryUrl(locale, category.id),
            inLanguage: locale,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: categoryTools.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: tool.name,
                url: toolUrl(locale, tool.slug),
              })),
            },
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
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          {t("toolCount", { count: categoryTools.length })}
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        {t(`desc.${category.id}`)}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

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
        {t("ctaAllTools", { count: tools.length })}
      </Link>
    </main>
  );
}