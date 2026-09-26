import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(params.locale);
  const tAbout = await getTranslations("Info.about");
  return {
    title: tAbout("title"),
    description: tAbout("desc"),
      alternates: {
        canonical: params.locale === "en" ? "/about" : `/${params.locale}/about`,
        languages: {
          en: "https://www.freetoolsy.com/about",
          tr: "https://www.freetoolsy.com/tr/about",
        },
      },
      openGraph: {
        url: params.locale === "en" ? "/about" : `/${params.locale}/about`,
      },
    };
  }

interface AboutSection {
  h?: string;
  p?: string;
  pre?: string;
  link?: string;
  route?: string;
  post?: string;
}

export default async function HakkimizdaPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const locale = await getLocale();
  const isTr = locale === "tr";
  const tInfo = await getTranslations("Info");
  const tTool = await getTranslations("ToolPage");
  const tAbout = await getTranslations("Info.about");
  const sections = tAbout.raw("sections") as AboutSection[];
  const environment = isTr ? "tr" : "en";
  const url = `https://www.freetoolsy.com${isTr ? "/tr" : ""}/about`;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FreetoolsY",
            url: "https://www.freetoolsy.com/",
            description: tAbout("jsonDesc"),
            email: "support@freetoolsy.com",
          },
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: tAbout("navLabel"),
            url,
            inLanguage: environment,
          },
        ]}
      />
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
        <span className="text-text">{tAbout("navLabel")}</span>
      </nav>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
        {tAbout("h1")}
      </h1>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        {tAbout("p1")}
      </p>

      <section className="mt-8 space-y-8 text-sm leading-relaxed text-muted sm:text-base">
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-base font-semibold text-text">{section.h}</h2>
            {section.p ? <p className="mt-2">{section.p}</p> : null}
            {!section.p && section.pre ? (
              <p className="mt-2">
                {section.pre}{" "}
                <Link
                  href={section.route ?? "/contact"}
                  className="font-medium text-accent transition-opacity hover:opacity-80"
                >
                  {section.link}
                </Link>{" "}
                {section.post}
              </p>
            ) : null}
          </div>
        ))}
      </section>
    </main>
  );
}