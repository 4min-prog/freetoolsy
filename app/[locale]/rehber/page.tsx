import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { guides } from "@/data/guides";
import { routing, type Locale } from "@/i18n/routing";

const siteUrl = "https://freetoolsy.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Rehber");
  return {
    title: t("title"),
    description: t("pageDesc"),
    alternates: {
      canonical: locale === "en" ? "/rehber" : `/${locale}/rehber`,
      languages: {
        en: `${siteUrl}/rehber`,
        tr: `${siteUrl}/tr/rehber`,
      },
    },
  };
}

export default async function RehberIndex({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Rehber");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="max-w-[22ch] text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted">
        {t("pageDesc")}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {guides.map((guide) => {
          const content = guide.content[locale];
          return (
            <Link
              key={guide.slug}
              href={`/rehber/${guide.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-card-hover"
            >
              <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-text">
                {content.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {content.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                {t("backToAll")}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}