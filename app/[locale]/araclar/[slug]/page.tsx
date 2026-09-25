import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categories, getTool, tools, type Tool } from "@/data/tools";
import type { Locale } from "@/i18n/routing";
import {
  categoryPath,
  categoryUrl,
  localizedUrl,
  toolPath,
  toolUrl,
} from "@/lib/paths";
import { pickToolMessages } from "@/lib/clientMessages";
import { POPULAR_SLUGS } from "@/data/popular";
import { DYNAMIC_TOOL_SLUGS } from "@/data/dynamicTools";
import { toolComponents } from "@/data/toolComponents";
import ToolDynamic from "@/components/tools/ToolDynamic";
import { guides } from "@/data/guides";
import JsonLd from "@/components/JsonLd";
import ToolJsonLd from "@/components/ToolJsonLd";
import ToolFaqJsonLd from "@/components/ToolFaqJsonLd";
import ToolFaq from "@/components/ToolFaq";
import ToolSeoContent from "@/components/ToolSeoContent";
import ToolIcon from "@/components/ToolIcon";
import ToolViewTracker from "@/components/ToolViewTracker";
import { categoryTheme } from "@/components/categoryTheme";


export const dynamicParams = false;

export function generateStaticParams() {  const params: { locale: string; slug: string }[] = [];
  tools.forEach((tool) => {
    params.push({ locale: "tr", slug: tool.slug });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const tool = getTool(params.slug);
  if (!tool) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations(`ToolMeta.${tool.slug}`);
  return {
    title: t("title"),
    description: t("pageDesc"),
    alternates: {
      canonical: localizedUrl(locale, toolPath(locale, tool.slug)),
      languages: {
        en: toolUrl("en", tool.slug),
        tr: toolUrl("tr", tool.slug),
      },
    },
  };
}

export default async function AraclarPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations(`ToolMeta.${tool.slug}`);
  const tc = await getTranslations("Categories");
  const tPage = await getTranslations("ToolPage");
  const tRehber = await getTranslations("Rehber");
  const tInfo = await getTranslations("Info");
  const messages = await getMessages();
  const toolMessages = pickToolMessages(messages, tool.slug);
  const meta = (messages as { ToolMeta?: Record<string, { name?: string }> })
    .ToolMeta;
  const similarTools = tools
    .filter((item) => item.slug !== tool.slug && item.category === tool.category)
    .filter((item) => !POPULAR_SLUGS.includes(item.slug))
    .slice(0, 4);
  const popularTools = POPULAR_SLUGS.map((slug) => getTool(slug))
    .filter(
      (item): item is Tool => item !== undefined && item.slug !== tool.slug
    )
    .slice(0, 6);

  const theme = categoryTheme(tool.category);
  const guideLinks = guides.filter((guide) =>
    guide.relatedTools.includes(tool.slug)
  );

  const ToolComponent = toolComponents[tool.slug];
  if (!ToolComponent && !DYNAMIC_TOOL_SLUGS.has(tool.slug)) notFound();

  const category = categories.find((item) => item.id === tool.category);
  const categoryId = category ? category.id : tool.category;
  const homeUrl = localizedUrl(locale, "/");

  return (
    <main
      className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14"
      style={{ "--cat-accent": theme.hex } as React.CSSProperties}
    >
      <ToolViewTracker slug={tool.slug} />
      <ToolJsonLd slug={tool.slug} />
      <ToolFaqJsonLd slug={tool.slug} />
      <JsonLd
        data={{
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
              name: tc(tool.category),
              item: categoryUrl(locale, categoryId),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: t("name"),
              item: toolUrl(locale, tool.slug),
            },
          ],
        }}
      />
      <nav
        aria-label={tPage("breadcrumbAria")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text">
          {tInfo("breadcrumbHome")}
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link
          href={categoryPath(locale, categoryId)}
          className="transition-colors hover:text-text"
        >
          {tc(tool.category)}
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">{t("name")}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${
            categoryTheme(tool.category).iconBg
          }`}
        >
          <ToolIcon
            id={tool.slug}
            className={`h-6 w-6 ${categoryTheme(tool.category).iconText}`}
          />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {t("name")}
        </h1>
        <span
          className="rounded-md border px-2 py-0.5 text-xs font-medium"
          style={{
            color: theme.hex,
            backgroundColor: `${theme.hex}14`,
            borderColor: `${theme.hex}33`,
          }}
        >
          {tc(tool.category)}
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        {t("pageDesc")}
      </p>

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <NextIntlClientProvider messages={toolMessages}>
          {DYNAMIC_TOOL_SLUGS.has(tool.slug) ? (
            <ToolDynamic slug={tool.slug} />
          ) : (
            <ToolComponent />
          )}
        </NextIntlClientProvider>
      </div>

      <ToolSeoContent slug={tool.slug} />

      <ToolFaq slug={tool.slug} />

      {guideLinks.length > 0 && (
        <section
          aria-label={tRehber("relatedToolsTitle")}
          className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-card"
        >
          <h2 className="text-base font-semibold tracking-tight text-text">
            {tRehber("backToAll")}
          </h2>
          <ul className="mt-4 space-y-2">
            {guideLinks.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/rehber/${guide.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <span aria-hidden="true" className="text-accent">
                    â†’
                  </span>
                  <span className="truncate">{guide.content[locale].title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {similarTools.length > 0 && (
        <section
          aria-label={tPage("similarTitle")}
          className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold tracking-tight text-text">
              {tPage("similarTitle")}
            </h2>
            <Link
              href={categoryPath(locale, categoryId)}
              className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              {tPage("otherAll")}
            </Link>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {similarTools.map((item) => (
              <li key={item.slug}>
                <Link
                  href={toolPath(locale, item.slug)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <ToolIcon id={item.slug} className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate">{meta?.[item.slug]?.name ?? item.slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {popularTools.length > 0 && (
        <section
          aria-label={tPage("otherTitle")}
          className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold tracking-tight text-text">
              {tPage("otherTitle")}
            </h2>
            <Link
              href="/"
              className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              {tPage("otherAll")}
            </Link>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {popularTools.map((item) => (
              <li key={item.slug}>
                <Link
                  href={toolPath(locale, item.slug)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <ToolIcon id={item.slug} className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate">{meta?.[item.slug]?.name ?? item.slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-center text-sm text-muted">
        {tPage("linklyPre")}{" "}
        <a
          href="https://linklyhub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent transition-opacity hover:opacity-80"
        >
          linklyhub.com
        </a>{" "}
        {tPage("linklyPost")}
      </p>
    </main>
  );
}
