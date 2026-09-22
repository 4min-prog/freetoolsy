import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, getTool, tools } from "@/data/tools";
import { routing, type Locale } from "@/i18n/routing";
import KarakterSayaci from "@/components/tools/KarakterSayaci";
import KelimeSayaci from "@/components/tools/KelimeSayaci";
import HarfDonusturucu from "@/components/tools/HarfDonusturucu";
import SifreUretici from "@/components/tools/SifreUretici";
import JsonFormatter from "@/components/tools/JsonFormatter";
import Base64Encoder from "@/components/tools/Base64Encoder";
import UrlEncoder from "@/components/tools/UrlEncoder";
import BmiHesaplayici from "@/components/tools/BmiHesaplayici";
import KdvHesaplayici from "@/components/tools/KdvHesaplayici";
import YuzdeHesaplayici from "@/components/tools/YuzdeHesaplayici";
import YasHesaplayici from "@/components/tools/YasHesaplayici";
import QrKodOlusturucu from "@/components/tools/QrKodOlusturucu";
import ShaHashUretici from "@/components/tools/ShaHashUretici";
import TarihFarki from "@/components/tools/TarihFarki";
import RenkDonusturucu from "@/components/tools/RenkDonusturucu";
import UuidUretici from "@/components/tools/UuidUretici";
import BirimDonusturucu from "@/components/tools/BirimDonusturucu";
import ParolaGucTesti from "@/components/tools/ParolaGucTesti";
import SayiDonusturucu from "@/components/tools/SayiDonusturucu";
import RegexTesti from "@/components/tools/RegexTesti";
import BoslukTemizleyici from "@/components/tools/BoslukTemizleyici";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import ToolJsonLd from "@/components/ToolJsonLd";
import ToolSeoContent from "@/components/ToolSeoContent";

const toolComponents: Record<string, React.ComponentType> = {
  "karakter-sayaci": KarakterSayaci,
  "kelime-sayaci": KelimeSayaci,
  "harf-donusturucu": HarfDonusturucu,
  "sifre-uretici": SifreUretici,
  "json-formatter": JsonFormatter,
  "base64": Base64Encoder,
  "url-encoder": UrlEncoder,
  "bmi-hesaplayici": BmiHesaplayici,
  "kdv-hesaplayici": KdvHesaplayici,
  "yuzde-hesaplayici": YuzdeHesaplayici,
  "yas-hesaplayici": YasHesaplayici,
  "qr-kod-olusturucu": QrKodOlusturucu,
  "sha-hash-uretici": ShaHashUretici,
  "tarih-farki": TarihFarki,
  "renk-donusturucu": RenkDonusturucu,
  "uuid-uretici": UuidUretici,
  "birim-donusturucu": BirimDonusturucu,
  "parola-guc-testi": ParolaGucTesti,
  "sayi-donusturucu": SayiDonusturucu,
  "regex-testi": RegexTesti,
  "bosluk-temizleyici": BoslukTemizleyici,
};

const siteUrl = "https://freetoolsy.vercel.app";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach((locale) => {
    tools.forEach((tool) => {
      params.push({ locale, slug: tool.slug });
    });
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
      canonical: locale === "en" ? `/araclar/${tool.slug}` : `/${locale}/araclar/${tool.slug}`,
      languages: {
        en: `${siteUrl}/araclar/${tool.slug}`,
        tr: `${siteUrl}/tr/araclar/${tool.slug}`,
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
  const tInfo = await getTranslations("Info");

  const ToolComponent = toolComponents[tool.slug];
  if (!ToolComponent) notFound();

  const category = categories.find((item) => item.id === tool.category);
  const toolUrl = `${siteUrl}${locale === "en" ? "" : "/tr"}/araclar/${tool.slug}`;
  const homeUrl = `${siteUrl}${locale === "en" ? "" : "/tr"}/`;
  const categoryUrl = `${siteUrl}${locale === "en" ? "" : "/tr"}/#${category ? category.id : tool.category}`;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <ToolJsonLd slug={tool.slug} />
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
              item: categoryUrl,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: t("name"),
              item: toolUrl,
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
          href={`/#${category ? category.id : tool.category}`}
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
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          {t("name")}
        </h1>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
          {tc(tool.category)}
        </span>
      </div>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted sm:text-base">
        {t("pageDesc")}
      </p>

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <ToolComponent />
      </div>

      <AdSlot slot="bottom" />

      <ToolSeoContent slug={tool.slug} />

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