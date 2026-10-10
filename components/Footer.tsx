import { Link } from "@/i18n/navigation";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { categoryPath, toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";
import CategoryIcon from "@/components/CategoryIcon";
import { categoryTheme } from "@/components/categoryTheme";
import Image from "next/image";
import Logo from "@/components/Logo";
import { categories, getToolsByCategory, tools, type Tool } from "@/data/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const POPULAR_TOOLS = [
  "password-generator",
  "qr-code-generator",
  "json-formatter",
  "url-encoder",
  "image-compressor",
  "color-converter",
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
        {children}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}

export default async function Footer() {
  const t = await getTranslations("Footer");
  const tc = await getTranslations("Categories");
  const messages = await getMessages();
  const locale = (await getLocale()) as Locale;
  const meta = (messages as { ToolMeta?: Record<string, { name?: string }> })
    .ToolMeta;

  const linkClass =
    "flex items-center text-sm text-muted transition-colors hover:text-text";

  const popularTools = POPULAR_TOOLS.map((slug) =>
    tools.find((tool) => tool.slug === slug)
  ).filter((tool): tool is Tool => Boolean(tool));

  return (
    <footer className="mt-auto bg-surface">
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr] lg:items-start">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <p className="max-w-[42ch] text-sm leading-relaxed text-muted">
            {t("desc")}
          </p>
        </div>

        <div>
          <Label>{t("corporate")}</Label>
          <ul className="mt-4 space-y-1">
            <li>
              <Link href="/about" className={`min-h-9 ${linkClass}`}>
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className={`min-h-9 ${linkClass}`}>
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={`min-h-9 ${linkClass}`}>
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link href="/rehber" className={`min-h-9 ${linkClass}`}>
                {t("guides")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <Label>{t("popular")}</Label>
          <ul className="mt-4 space-y-1">
            {popularTools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={toolPath(locale, tool.slug)}
                  className={`group min-h-9 ${linkClass}`}
                >
                  <span aria-hidden="true" className="mr-1.5 text-accent transition-transform group-hover:translate-x-0.5">
                    <FontAwesomeIcon icon={faChevronRight} className="h-2.5 w-2.5" />
                  </span>
                  {meta?.[tool.slug]?.name ?? tool.slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Label>{t("partner")}</Label>
          <ul className="mt-4 space-y-1">
            <li>
              <a
                href="https://linklyhub.com"
                target="_blank"
                rel="noopener noreferrer"
                title="LinklyHub"
                className={`min-h-9 flex-wrap ${linkClass}`}
              >
                <span className="mr-1.5">{t("linklyLabel")}</span>
                <span aria-hidden="true" className="mr-1">
                  <FontAwesomeIcon icon={faChevronRight} className="h-2 w-2" />
                </span>
                <Image
                  src="/linklyhub-logo.png"
                  alt="LinklyHub"
                  width={1080}
                  height={1350}
                  loading="lazy"
                  decoding="async"
                  className="h-6 w-auto shrink-0 self-center"
                />
                <span>{t("linkly")}</span>
              </a>
            </li>
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href="https://launchnest.io/p/freetoolsy"
              rel="dofollow noopener noreferrer"
              title="freetoolsy.com — Domain Rating by LaunchNest"
              target="_blank"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://launchnest.io/api/badge/dr?domain=freetoolsy.com&style=normal&shape=rect&color=dark"
                alt="freetoolsy.com Domain Rating"
                width="240"
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-md border border-border bg-bg transition-opacity hover:opacity-80"
              />
            </a>
            <a href="https://launchnest.io/p/freetoolsy" target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://launchnest.io/brand/badges/listed-dark.svg"
                alt="Listed on LaunchNest"
                width="150"
                loading="lazy"
                className="h-auto w-full rounded-md border border-border bg-bg transition-opacity hover:opacity-80"
              />
            </a>
            <a
              href="https://openhunts.com"
              target="_blank"
              title="OpenHunts Club"
              className="col-span-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="OpenHunts Club Member"
                height="105"
                loading="lazy"
                src="https://cdn.openhunts.com/badges/club.webp"
                style={{ width: "100%", height: "auto" }}
                className="h-auto w-full rounded-md border border-border bg-bg transition-opacity hover:opacity-80"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-2 sm:px-6 sm:pb-10">
        <Label>{t("tools")}</Label>
        <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            return (
              <li key={category.id}>
                <p className="flex items-center gap-2 text-sm font-semibold text-text">
                  <CategoryIcon
                    id={category.id}
                    className={`h-4 w-4 shrink-0 ${categoryTheme(category.id).iconText}`}
                  />
                  {tc(category.id)}
                </p>
                <ul className="mt-1 space-y-0">
                  {categoryTools.slice(0, 5).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={toolPath(locale, tool.slug)}
                        className={linkClass}
                      >
                        {meta?.[tool.slug]?.name ?? tool.slug}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={categoryPath(locale, category.id)}
                      className="inline-flex min-h-9 items-center gap-1 text-sm font-medium text-accent transition-opacity hover:opacity-80"
                    >
                      {t("viewAll")}
                      <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t("rights")}</p>
          <nav
            aria-label={t("navLabel")}
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            <Link href="/about" className="transition-colors hover:text-text">
              {t("about")}
            </Link>
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-text"
            >
              {t("privacy")}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-text">
              {t("contact")}
            </Link>
            <a href="/sitemap.xml" className="transition-colors hover:text-text">
              {t("sitemap")}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}