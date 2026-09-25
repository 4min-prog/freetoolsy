import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { guides, getGuide } from "@/data/guides";
import { getTool } from "@/data/tools";
import { routing, type Locale } from "@/i18n/routing";
import { toolPath } from "@/lib/paths";
import ToolIcon from "@/components/ToolIcon";

const siteUrl = "https://freetoolsy.com";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach((locale) => {
    guides.forEach((guide) => {
      params.push({ locale, slug: guide.slug });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const content = guide.content[locale];
  return {
    title: content.title,
    description: content.desc,
    alternates: {
      canonical: locale === "en" ? `/rehber/${guide.slug}` : `/${locale}/rehber/${guide.slug}`,
      languages: {
        en: `${siteUrl}/rehber/${guide.slug}`,
        tr: `${siteUrl}/tr/rehber/${guide.slug}`,
      },
    },
  };
}

export default async function RehberDetay({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Rehber");
  const content = guide.content[locale];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav
        aria-label={t("breadcrumbAria")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text">
          {t("home")}
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <Link href="/rehber" className="transition-colors hover:text-text">
          {t("backToAll")}
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="truncate text-text">{content.title}</span>
      </nav>

      <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
        {content.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">{content.intro}</p>

      <div className="mt-8 space-y-10">
        {content.blocks.map((block, index) => (
          <section key={index}>
            <h2 className="text-xl font-semibold tracking-tight text-text">
              {block.h2}
            </h2>
            {block.paragraphs.map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className="mt-3 text-sm leading-relaxed text-muted sm:text-base"
              >
                {paragraph}
              </p>
            ))}
            {block.bullets && (
              <ul className="mt-4 space-y-2">
                {block.bullets.map((bullet, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-2.5 text-sm text-muted sm:text-base">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="mt-1.5 h-4 w-4 shrink-0 text-accent"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {guide.relatedTools.length > 0 && (
        <section
          aria-label={t("relatedToolsTitle")}
          className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-card"
        >
          <h2 className="text-base font-semibold tracking-tight text-text">
            {t("relatedToolsTitle")}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {guide.relatedTools.map((slug) => {
              const tool = getTool(slug);
              return (
                <li key={slug}>
                  <Link
                    href={toolPath(locale, slug)}
                    className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <ToolIcon id={slug} className="h-4 w-4 shrink-0 text-accent" />
                    {tool?.name ?? slug}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <Link
        href="/rehber"
        className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
      >
        <span aria-hidden="true">←</span>
        {t("backToAll")}
      </Link>
    </main>
  );
}