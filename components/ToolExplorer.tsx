"use client";

import { useEffect, useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import ToolCard from "@/components/ToolCard";
import CategoryIcon from "@/components/CategoryIcon";
import { Link } from "@/i18n/navigation";
import { categoryTheme } from "@/components/categoryTheme";
import { categories, getToolsByCategory, tools } from "@/data/tools";

interface ToolMetaNs {
  name?: string;
  desc?: string;
}

export default function ToolExplorer() {
  const t = useTranslations("ToolExplorer");
  const tc = useTranslations("Categories");
  const messages = useMessages();
  const meta = messages.ToolMeta as Record<string, ToolMetaNs> | undefined;
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [visible, setVisible] = useState<Record<string, number>>({});

  useEffect(() => {
    function sync() {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && hash !== cat && categories.some((c) => c.id === hash)) {
        setCat(hash);
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

  const filtered = normalized
    ? tools.filter((tool) => {
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
    requestAnimationFrame(() => {
      document.getElementById(id || "tools-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const tabClass = (active: boolean, catId?: string) => {
    const theme = catId ? categoryTheme(catId) : null;
    if (active && theme) {
      return `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${theme.active}`;
    }
    return `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
      active
        ? "btn-accent font-medium text-on-accent"
        : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
    }`;
  };

  return (
    <div id="tools-explorer" className="scroll-mt-20 pb-20">
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => selectCategory("")}
          className={tabClass(!cat)}
        >
          {t("tabAll")}
          <span
            className={`rounded-full px-1.5 text-xs ${
              !cat ? "bg-white/20" : "bg-surface-2 text-faint"
            }`}
          >
            {tools.length}
          </span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => selectCategory(category.id)}
            className={tabClass(cat === category.id, category.id)}
          >
            <CategoryIcon
              id={category.id}
              className={`h-4 w-4 ${categoryTheme(category.id).iconText}`}
            />
            {tc(category.id)}
            <span
              className={`rounded-full px-1.5 text-xs ${
                cat === category.id
                  ? "bg-white/20"
                  : "bg-surface-2 text-faint"
              }`}
            >
              {getToolsByCategory(category.id).length}
            </span>
          </button>
        ))}
      </div>

      {filtered ? (
        <section className="mt-10" aria-live="polite">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h2 className="text-lg font-semibold tracking-tight text-text">
              {t("results")}
            </h2>
            <span className="text-sm text-muted">
              {t("toolCount", { count: filtered.length })}
            </span>
          </div>
          {filtered.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted">{t("noResults", { query })}</p>
          )}
        </section>
      ) : (
        <div className="mt-10 space-y-14">
          {(cat ? categories.filter((c) => c.id === cat) : categories).map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            if (categoryTools.length === 0) return null;
            const theme = categoryTheme(category.id);
            const shown = visible[category.id] ?? 9;
            const remaining = categoryTools.length - shown;
            const shownTools = categoryTools.slice(0, shown);
            return (
              <section key={category.id} id={category.id} className="scroll-mt-20">
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                  <h2 className="flex items-center gap-2.5">
                    <CategoryIcon
                      id={category.id}
                      className={`h-5 w-5 ${theme.iconText}`}
                    />
                    <span className="text-lg font-semibold tracking-tight text-text">
                      {tc(category.id)}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-faint">
                      {String(categoryTools.length).padStart(2, "0")}
                    </span>
                  </h2>
                  <Link
                    href={`/kategoriler/${category.id}`}
                    className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
                  >
                    <span className="underline decoration-border underline-offset-4 group-hover:decoration-accent">
                      {t("viewAll", { count: categoryTools.length })}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {shownTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
                {remaining > 0 && (
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisible((prev) => ({
                          ...prev,
                          [category.id]: (prev[category.id] ?? 9) + 9,
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-text"
                    >
                      {t("showMore", { count: Math.min(remaining, 9) })}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="h-4 w-4"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}