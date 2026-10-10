"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import ToolCard from "@/components/ToolCard";
import CategoryIcon from "@/components/CategoryIcon";
import { Link } from "@/i18n/navigation";
import { categoryTheme } from "@/components/categoryTheme";
import {
  categories,
  getToolsByCategory,
  tools,
} from "@/data/tools";
import { getNewestTools, getPopularTools } from "@/data/popular";
import { categoryPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type SortMode = "all" | "popular" | "newest";

interface ToolMetaNs {
  name?: string;
  desc?: string;
}

export default function ToolExplorer() {
  const t = useTranslations("ToolExplorer");
  const locale = useLocale() as Locale;
  const tf = useTranslations("Footer");
  const tc = useTranslations("Categories");
  const messages = useMessages();
  const meta = messages.ToolMeta as Record<string, ToolMetaNs> | undefined;
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState<SortMode>("all");
  const firstLoad = useRef(true);


  useEffect(() => {
    function sync() {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && hash !== cat && categories.some((c) => c.id === hash)) {
        setCat(hash);
        if (firstLoad.current) {
          window.setTimeout(() => {
            const target =
              document.getElementById(hash) ??
              document.getElementById("tools-explorer");
            target?.scrollIntoView({ behavior: "auto", block: "start" });
          }, 0);
        }
      }
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setQuery(q);
        requestAnimationFrame(() => {
          document
            .getElementById("tools-explorer")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      firstLoad.current = false;
    }
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("freetoolsy:search", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("freetoolsy:search", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalized = query.toLocaleLowerCase().trim();

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const target =
      (cat ? document.getElementById(cat) : null) ??
      document.getElementById("tools-explorer");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [cat]);

  const ordered = useMemo<typeof tools>(() => {
    if (sort === "popular") return getPopularTools();
    if (sort === "newest") return getNewestTools();
    return tools;
  }, [sort]);

  const scoped = cat ? ordered.filter((tool) => tool.category === cat) : ordered;

  const filtered = normalized
    ? scoped.filter((tool) => {
        const toolMeta = meta ? meta[tool.slug] : undefined;
        const name = toolMeta ? toolMeta.name ?? "" : tool.slug;
        const desc = toolMeta ? toolMeta.desc ?? "" : "";
        return [name, desc, tool.slug, tool.category]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalized);
      })
    : null;

  function selectCategory(id: string) {
    setCat(id);
    if (id) {
      history.replaceState(null, "", `#${id}`);
    } else {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  const sortOptions: { id: SortMode; label: string; count?: number }[] = [
    { id: "all", label: t("tabAll"), count: tools.length },
    { id: "popular", label: t("sortPopular"), count: getPopularTools().length },
    { id: "newest", label: t("sortNewest"), count: getNewestTools().length },
  ];

  return (
    <div id="tools-explorer" className="scroll-mt-20 pb-28 sm:pb-20">
      <div
        role="tablist"
        aria-label={t("sortLabel")}
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto overflow-y-hidden px-4 py-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {sortOptions.map((option) => {
          const active = sort === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSort(option.id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                active
                  ? "border-transparent bg-accent text-on-accent"
                  : "border-border bg-surface text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              {option.id === "newest" && (
                <span
                  aria-hidden="true"
                  className={`text-[10px] ${active ? "text-on-accent/70" : "text-faint"}`}
                >
                  +
                </span>
              )}
              {option.label}
              {option.count !== undefined && (
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    active ? "text-on-accent/70" : "text-faint"
                  }`}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <nav
        aria-label={t("categories")}
        className="lg:hidden -mx-4 flex gap-2 overflow-x-auto overflow-y-hidden px-4 py-2 [scrollbar-width:none]"
      >
        <button
          type="button"
          onClick={() => selectCategory("")}
          aria-pressed={!cat}
          className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
            !cat
              ? "border-transparent bg-accent text-on-accent"
              : "border-border bg-surface text-muted"
          }`}
        >
          {t("tabAll")}
        </button>
        {categories.map((category) => {
          const active = cat === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category.id)}
              aria-pressed={active}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                active
                  ? "border-transparent bg-accent text-on-accent"
                  : "border-border bg-surface text-muted"
              }`}
            >
              {tc(category.id)}
            </button>
          );
        })}
      </nav>
      <div className="mt-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
        <nav className="hidden lg:block" aria-label={t("categories")}>
          <div className="sticky top-24">
            <button
              type="button"
              onClick={() => selectCategory("")}
              className={`group flex w-full items-center justify-between gap-2 border-b border-l-2 py-3 pl-3 pr-2 text-left text-sm transition-colors ${
                !cat
                  ? "border-l-accent bg-surface-2 font-medium text-foreground"
                  : "border-l-transparent text-muted hover:border-l-border hover:bg-surface/60 hover:text-foreground"
              }`}
            >
              <span className="transition-transform duration-200 group-hover:translate-x-2.5">
                {t("tabAll")}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-faint transition-colors group-hover:text-muted">
                {tools.length}
              </span>
            </button>
            {categories.map((category) => {
              const active = cat === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={`group flex w-full items-center justify-between gap-2 border-b border-l-2 py-3 pl-3 pr-2 text-left text-sm transition-colors ${
                    active
                      ? "border-l-accent bg-surface-2 font-medium text-foreground"
                      : "border-l-transparent text-muted hover:border-l-border hover:bg-surface/60 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-2.5">
                    <CategoryIcon
                      id={category.id}
                      className={`h-4 w-4 shrink-0 ${categoryTheme(category.id).iconText}`}
                    />
                    {tc(category.id)}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-faint transition-colors group-hover:text-muted">
                    {getToolsByCategory(category.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div>
      {filtered ? (
        <section className="mt-0" aria-live="polite">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h2 className="text-lg font-semibold tracking-tight text-text">
              {t("results")}
            </h2>
            <span className="text-sm text-muted">
              {t("toolCount", { count: filtered.length })}
            </span>
          </div>
          {filtered.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {filtered.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted">{t("noResults", { query })}</p>
          )}
        </section>
      ) : sort === "all" ? (
        <div className="space-y-14">
          {(cat ? categories.filter((c) => c.id === cat) : categories).map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            if (categoryTools.length === 0) return null;
            const theme = categoryTheme(category.id);
            const shownTools = categoryTools.slice(0, 9);
            const remaining = categoryTools.length - shownTools.length;
            return (
              <section key={category.id} id={category.id} className="scroll-mt-20">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
                  <h2 className="flex items-center gap-2.5">
                    <CategoryIcon
                      id={category.id}
                      className={`h-5 w-5 ${theme.iconText}`}
                    />
                    <span className="text-lg font-semibold tracking-tight text-text">
                      {tc(category.id)}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-faint transition-colors group-hover:text-muted">
                      {String(categoryTools.length).padStart(2, "0")}
                    </span>
                  </h2>
                  <Link
                    href={categoryPath(locale, category.id)}
                    className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
                  >
                    <span className="underline decoration-border underline-offset-4 group-hover:decoration-accent">
                      {tf("viewAll")}
                    </span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {shownTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
                {remaining > 0 && (
                  <div className="mt-5 flex justify-center">
                    <Link
                      href={categoryPath(locale, category.id)}
                      className="group inline-flex min-h-11 items-center gap-2 border border-border px-5 text-sm text-muted transition-colors hover:border-foreground hover:bg-surface-2 hover:text-foreground"
                    >
                      {t("viewAll", { count: categoryTools.length })}
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <section className="mt-0" aria-live="polite">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h2 className="flex items-center gap-2.5">
              {sort === "popular" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-5 w-5 text-accent"
                >
                  <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8Z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-5 w-5 text-accent"
                >
                  <path d="M12 8v8M8 12h8" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              )}
              <span className="text-lg font-semibold tracking-tight text-text">
                {sort === "popular" ? t("sortPopular") : t("sortNewest")}
              </span>
            </h2>
            <span className="font-mono text-[11px] tabular-nums text-faint">
              {String(scoped.length).padStart(2, "0")}
            </span>
          </div>
          {scoped.length > 0 ? (
            <ol className="mt-5 grid gap-4 sm:grid-cols-2">
              {scoped.map((tool, index) => (
                <li key={tool.slug} className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-1 left-0 font-mono text-[10px] text-faint"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-8 text-sm text-muted">{t("noSortResults")}</p>
          )}
        </section>
      )}
        </div>
      </div>
    </div>
  );
}