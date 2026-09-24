import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, getTool, tools, type Tool } from "@/data/tools";
import { routing, type Locale } from "@/i18n/routing";
import { POPULAR_SLUGS } from "@/data/popular";
import { DYNAMIC_TOOL_SLUGS } from "@/data/dynamicTools";
import { guides } from "@/data/guides";
import CharacterCounter from "@/components/tools/CharacterCounter";
import WordCounter from "@/components/tools/WordCounter";
import CaseConverter from "@/components/tools/CaseConverter";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import JsonFormatter from "@/components/tools/JsonFormatter";
import Base64Encoder from "@/components/tools/Base64Encoder";
import UrlEncoder from "@/components/tools/UrlEncoder";
import BmiCalculator from "@/components/tools/BmiCalculator";
import VatCalculator from "@/components/tools/VatCalculator";
import PercentageCalculator from "@/components/tools/PercentageCalculator";
import AgeCalculator from "@/components/tools/AgeCalculator";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import ShaHashGenerator from "@/components/tools/ShaHashGenerator";
import DateDifference from "@/components/tools/DateDifference";
import ColorConverter from "@/components/tools/ColorConverter";
import UuidGenerator from "@/components/tools/UuidGenerator";
import UnitConverter from "@/components/tools/UnitConverter";
import PasswordStrengthChecker from "@/components/tools/PasswordStrengthChecker";
import NumberBaseConverter from "@/components/tools/NumberBaseConverter";
import RegexTester from "@/components/tools/RegexTester";
import WhitespaceCleaner from "@/components/tools/WhitespaceCleaner";
import Md5Hash from "@/components/tools/Md5Hash";
import JwtDecoder from "@/components/tools/JwtDecoder";
import JsonCsv from "@/components/tools/JsonCsv";
import TimestampConverter from "@/components/tools/TimestampConverter";
import DuplicateLineRemover from "@/components/tools/DuplicateLineRemover";
import AiTokenCounter from "@/components/tools/AiTokenCounter";
import LoremIpsumGenerator from "@/components/tools/LoremIpsumGenerator";
import TipCalculator from "@/components/tools/TipCalculator";
import DiscountCalculator from "@/components/tools/DiscountCalculator";
import AverageCalculator from "@/components/tools/AverageCalculator";
import DogAgeCalculator from "@/components/tools/DogAgeCalculator";
import SubnetCalculator from "@/components/tools/SubnetCalculator";
import PxRemConverter from "@/components/tools/PxRemConverter";
import XmlFormatter from "@/components/tools/XmlFormatter";
import CssMinifier from "@/components/tools/CssMinifier";
import HtmlMinifier from "@/components/tools/HtmlMinifier";
import WcagContrastChecker from "@/components/tools/WcagContrastChecker";
import ColorPaletteGenerator from "@/components/tools/ColorPaletteGenerator";
import BoxShadowGenerator from "@/components/tools/BoxShadowGenerator";
import TextSorter from "@/components/tools/TextSorter";
import ListShuffler from "@/components/tools/ListShuffler";
import YamlJson from "@/components/tools/YamlJson";
import Md5FileChecksum from "@/components/tools/Md5FileChecksum";
import ToolDynamic from "@/components/tools/ToolDynamic";
import SlugGenerator from "@/components/tools/SlugGenerator";
import MetaTagGenerator from "@/components/tools/MetaTagGenerator";
import KeywordDensityChecker from "@/components/tools/KeywordDensityChecker";
import SerpPreview from "@/components/tools/SerpPreview";
import ReadabilityScore from "@/components/tools/ReadabilityScore";
import TextDiff from "@/components/tools/TextDiff";
import HtmlEntityConverter from "@/components/tools/HtmlEntityConverter";
import MorseConverter from "@/components/tools/MorseConverter";
import TextReverser from "@/components/tools/TextReverser";
import FancyTextGenerator from "@/components/tools/FancyTextGenerator";
import CaesarCipher from "@/components/tools/CaesarCipher";
import GpaCalculator from "@/components/tools/GpaCalculator";
import LoanEmiCalculator from "@/components/tools/LoanEmiCalculator";
import CalorieBmrCalculator from "@/components/tools/CalorieBmrCalculator";
import BodyFatCalculator from "@/components/tools/BodyFatCalculator";
import IdealWeightCalculator from "@/components/tools/IdealWeightCalculator";
import SleepCalculator from "@/components/tools/SleepCalculator";
import CronTester from "@/components/tools/CronTester";
import HtmlFormatter from "@/components/tools/HtmlFormatter";
import AesEncryption from "@/components/tools/AesEncryption";
import RandomStringGenerator from "@/components/tools/RandomStringGenerator";
import JwtGenerator from "@/components/tools/JwtGenerator";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import ToolJsonLd from "@/components/ToolJsonLd";
import ToolFaqJsonLd from "@/components/ToolFaqJsonLd";
import ToolFaq from "@/components/ToolFaq";
import ToolSeoContent from "@/components/ToolSeoContent";
import ToolIcon from "@/components/ToolIcon";
import ToolViewTracker from "@/components/ToolViewTracker";
import { categoryTheme } from "@/components/categoryTheme";

const toolComponents: Record<string, React.ComponentType> = {
  "character-counter": CharacterCounter,
  "word-counter": WordCounter,
  "case-converter": CaseConverter,
  "password-generator": PasswordGenerator,
  "json-formatter": JsonFormatter,
  "base64": Base64Encoder,
  "url-encoder": UrlEncoder,
  "bmi-calculator": BmiCalculator,
  "vat-calculator": VatCalculator,
  "percentage-calculator": PercentageCalculator,
  "age-calculator": AgeCalculator,
  "qr-code-generator": QrCodeGenerator,
  "sha-hash-generator": ShaHashGenerator,
  "date-difference": DateDifference,
  "color-converter": ColorConverter,
  "uuid-generator": UuidGenerator,
  "unit-converter": UnitConverter,
  "password-strength-checker": PasswordStrengthChecker,
  "number-base-converter": NumberBaseConverter,
  "regex-tester": RegexTester,
  "whitespace-cleaner": WhitespaceCleaner,
  "md5-hash": Md5Hash,
  "jwt-decoder": JwtDecoder,
  "json-csv-converter": JsonCsv,
  "unix-timestamp-converter": TimestampConverter,
  "duplicate-line-remover": DuplicateLineRemover,
  "ai-token-counter": AiTokenCounter,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "tip-calculator": TipCalculator,
  "discount-calculator": DiscountCalculator,
  "average-calculator": AverageCalculator,
  "dog-age-calculator": DogAgeCalculator,
  "subnet-calculator": SubnetCalculator,
  "px-rem-converter": PxRemConverter,
  "xml-formatter": XmlFormatter,
  "css-minifier": CssMinifier,
  "html-minifier": HtmlMinifier,
  "wcag-contrast-checker": WcagContrastChecker,
  "color-palette-generator": ColorPaletteGenerator,
  "box-shadow-generator": BoxShadowGenerator,
  "text-sorter": TextSorter,
  "list-shuffler": ListShuffler,
  "yaml-json-converter": YamlJson,
  "md5-file-checksum": Md5FileChecksum,
  "slug-generator": SlugGenerator,
  "meta-tag-generator": MetaTagGenerator,
  "keyword-density-checker": KeywordDensityChecker,
  "serp-preview": SerpPreview,
  "readability-score": ReadabilityScore,
  "text-diff": TextDiff,
  "html-entity-converter": HtmlEntityConverter,
  "morse-converter": MorseConverter,
  "text-reverser": TextReverser,
  "fancy-text-generator": FancyTextGenerator,
  "caesar-cipher": CaesarCipher,
  "gpa-calculator": GpaCalculator,
  "loan-emi-calculator": LoanEmiCalculator,
  "calorie-bmr-calculator": CalorieBmrCalculator,
  "body-fat-calculator": BodyFatCalculator,
  "ideal-weight-calculator": IdealWeightCalculator,
  "sleep-calculator": SleepCalculator,
  "cron-tester": CronTester,
  "html-formatter": HtmlFormatter,
  "aes-encryption": AesEncryption,
  "random-string-generator": RandomStringGenerator,
  "jwt-generator": JwtGenerator,
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
  const tRehber = await getTranslations("Rehber");
  const tInfo = await getTranslations("Info");
  const messages = await getMessages();
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
  const toolUrl = `${siteUrl}${locale === "en" ? "" : "/tr"}/araclar/${tool.slug}`;
  const homeUrl = `${siteUrl}${locale === "en" ? "" : "/tr"}/`;
  const categoryUrl = `${siteUrl}${locale === "en" ? "" : "/tr"}/kategoriler/${category ? category.id : tool.category}`;

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
          href={`/kategoriler/${category ? category.id : tool.category}`}
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

      <AdSlot slot="top" />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card sm:p-6">
        {DYNAMIC_TOOL_SLUGS.has(tool.slug) ? (
          <ToolDynamic slug={tool.slug} />
        ) : (
          <ToolComponent />
        )}
      </div>

      <AdSlot slot="bottom" />

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
                    →
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
              href={`/kategoriler/${category ? category.id : tool.category}`}
              className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              {tPage("otherAll")}
            </Link>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {similarTools.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/araclar/${item.slug}`}
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
                  href={`/araclar/${item.slug}`}
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