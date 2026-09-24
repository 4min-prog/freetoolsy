import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface PrivacySection {
  h?: string;
  p?: string;
  pre?: string;
  link?: string;
  url?: string;
  post?: string;
  post2?: string;
  url2?: string;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(params.locale);
  const tPrivacy = await getTranslations("Info.privacy");
  return {
    title: tPrivacy("title"),
    description: tPrivacy("desc"),
    alternates: {
      canonical:
        params.locale === "en"
          ? "/privacy-policy"
          : `/${params.locale}/privacy-policy`,
      languages: {
        en: "https://freetoolsy.vercel.app/privacy-policy",
        tr: "https://freetoolsy.vercel.app/tr/privacy-policy",
      },
    },
  };
}

export default async function GizlilikPolitikasiPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const tPrivacy = await getTranslations("Info.privacy");
  const tTool = await getTranslations("ToolPage");
  const tInfo = await getTranslations("Info");
  const sections = tPrivacy.raw("sections") as PrivacySection[];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav
        aria-label={tTool("breadcrumbAria")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text">
          {tInfo("breadcrumbHome")}
        </Link>
        <span aria-hidden="true" className="text-faint">
          /
        </span>
        <span className="text-text">{tPrivacy("navLabel")}</span>
      </nav>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
        {tPrivacy("h1")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {tPrivacy("updated")}
      </p>

      <section className="mt-8 space-y-8 text-sm leading-relaxed text-muted sm:text-base">
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-base font-semibold text-text">{section.h}</h2>
            {section.link ? (
              <p className="mt-2">
                {section.pre ?? section.p ?? ""}{" "}
                {section.url ? (
                  <a
                    href={section.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent transition-opacity hover:opacity-80"
                  >
                    {section.link}
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="font-medium text-accent transition-opacity hover:opacity-80"
                  >
                    {section.link}
                  </Link>
                )}
                {section.post}
                {section.post2 ? (
                  <>
                    {" "}
                    <a
                      href={section.url2 ?? section.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent transition-opacity hover:opacity-80"
                    >
                      {section.post2}
                    </a>
                  </>
                ) : null}
              </p>
            ) : (
              <p className="mt-2">{section.p}</p>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}