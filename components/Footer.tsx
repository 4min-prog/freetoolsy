import { Link } from "@/i18n/navigation";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { categoryPath, toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";
import CategoryIcon from "@/components/CategoryIcon";
import { categoryTheme } from "@/components/categoryTheme";
import Image from "next/image";
import Logo from "@/components/Logo";
import { categories, getToolsByCategory } from "@/data/tools";

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

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <p className="max-w-[42ch] text-sm leading-relaxed text-muted">
            {t("desc")}
          </p>
        </div>

        <nav
          aria-label={t("navLabel")}
          className="flex flex-wrap gap-x-12 gap-y-8 md:gap-x-16"
        >
          <div className="min-w-[9rem]">
            <Label>{t("corporate")}</Label>
            <ul className="mt-4 space-y-1">
              <li>
                <Link
                  href="/about"
                  className="flex min-h-9 items-center text-sm text-muted transition-colors hover:text-text"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="flex min-h-9 items-center text-sm text-muted transition-colors hover:text-text"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex min-h-9 items-center text-sm text-muted transition-colors hover:text-text"
                >
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/rehber"
                  className="flex min-h-9 items-center text-sm text-muted transition-colors hover:text-text"
                >
                  {t("guides")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="min-w-[9rem]">
            <Label>{t("partner")}</Label>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://linklyhub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinklyHub"
                  className="flex min-h-9 flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted transition-colors hover:text-text"
                >
                  <span>{t("linklyLabel")}</span>
                  <span aria-hidden="true">→</span>
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
              <li>
                <a
                  href="https://launchnest.io/p/freetoolsy"
                  rel="dofollow noopener noreferrer"
                  title="freetoolsy.com — Domain Rating by LaunchNest"
                  target="_blank"
                >
                  <img
                    src="https://launchnest.io/api/badge/dr?domain=freetoolsy.com&style=normal&shape=rect&color=dark"
                    alt="freetoolsy.com Domain Rating"
                    width="240"
                    loading="lazy"
                    decoding="async"
                    className="h-auto rounded-md border border-border bg-bg transition-opacity hover:opacity-80"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://launchnest.io/p/freetoolsy"
                  target="_blank"
                  rel="noopener"
                >
                  <img
                    src="https://launchnest.io/brand/badges/listed-dark.svg"
                    alt="Listed on LaunchNest"
                    width="150"
                    loading="lazy"
                    className="h-auto rounded-md border border-border bg-bg transition-opacity hover:opacity-80"
                  />
                </a>
              </li>
              <li>
                <a href="https://openhunts.com" target="_blank" title="OpenHunts Club">
                  <img
                    alt="OpenHunts Club Member"
                    height="105"
                    loading="lazy"
                    src="https://cdn.openhunts.com/badges/club.webp"
                    style={{ width: "195px", height: "auto" }}
                    width="486"
                    className="h-auto rounded-md border border-border bg-bg transition-opacity hover:opacity-80"
                  />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-2 sm:px-6 sm:pb-10">
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
                        className="flex min-h-9 items-center text-sm text-muted transition-colors hover:text-text"
                      >
                        {meta?.[tool.slug]?.name ?? tool.slug}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={categoryPath(locale, category.id)}
                      className="inline-flex items-center gap-1 min-h-9 text-sm font-medium text-accent transition-opacity hover:opacity-80"
                    >
                      {t("viewAll")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-5xl px-4 py-4 text-xs text-muted sm:px-6">
          {t("rights")}
        </p>
      </div>
    </footer>
  );
}