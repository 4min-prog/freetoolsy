import { Link } from "@/i18n/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import CategoryIcon from "@/components/CategoryIcon";
import Logo from "@/components/Logo";
import { categories, getToolsByCategory } from "@/data/tools";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const tc = await getTranslations("Categories");
  const messages = await getMessages();
  const meta = (messages as { ToolMeta?: Record<string, { name?: string }> })
    .ToolMeta;

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-start md:justify-between">
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
          className="flex flex-wrap gap-x-10 gap-y-6 md:gap-x-16"
        >
          <div>
            <p className="text-sm font-semibold text-text">{t("corporate")}</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/rehber"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  {t("guides")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{t("partner")}</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://linklyhub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  {t("linkly")}
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="https://launchnest.io/p/freetoolsy"
                  target="_blank"
                  rel="noopener"
                >
                  <img
                    src="https://launchnest.io/brand/badges/listed-dark.svg"
                    alt="Listed on LaunchNest"
                    width="150"
                    className="h-auto rounded-md border border-border bg-surface transition-opacity hover:opacity-80"
                  />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-5xl border-t border-border px-4 pb-10 pt-8 sm:px-6">
        <p className="text-sm font-semibold text-text">{t("tools")}</p>
        <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            return (
              <li key={category.id}>
                <p className="flex items-center gap-2 text-sm font-semibold text-text">
                  <CategoryIcon id={category.id} className="h-4 w-4 shrink-0 text-accent" />
                  {tc(category.id)}
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {categoryTools.slice(0, 5).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/araclar/${tool.slug}`}
                        className="inline-block text-sm text-muted transition-colors hover:text-text"
                      >
                        {meta?.[tool.slug]?.name ?? tool.slug}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/kategoriler/${category.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-opacity hover:opacity-80"
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