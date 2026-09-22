"use client";

import { useRef, useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import ToolCard from "@/components/ToolCard";
import CategoryIcon from "@/components/CategoryIcon";
import { useRouter } from "@/i18n/navigation";
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
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const q = event.currentTarget.value.toLocaleLowerCase().trim();
    if (!q) return;
    const match = tools.find((tool) => {
      const toolMeta = meta ? meta[tool.slug] : undefined;
      const name = toolMeta ? toolMeta.name ?? "" : tool.slug;
      const desc = toolMeta ? toolMeta.desc ?? "" : "";
      return [name, desc, tool.slug, tool.category]
        .join(" ")
        .toLocaleLowerCase()
        .includes(q);
    });
    if (match) {
      event.preventDefault();
      router.push(`/araclar/${match.slug}`);
    }
  }

  function goToCategory(id: string) {
    setQuery("");
    requestAnimationFrame(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="pb-20">
      <div className="mx-auto w-full max-w-xl">
        <label htmlFor="arac-ara" className="sr-only">
          {t("searchLabel")}
        </label>
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-faint"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.2-3.2" />
          </svg>
          <input
            id="arac-ara"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-text placeholder:text-faint shadow-card transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
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
        <div className="mt-12 space-y-14">
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            if (categoryTools.length === 0) return null;
            return (
              <section key={category.id} id={category.id} className="scroll-mt-20">
                <button
                  type="button"
                  onClick={() => goToCategory(category.id)}
                  className="flex w-full items-baseline justify-between gap-4 border-b border-border pb-3 text-left transition-colors hover:border-accent"
                >
                  <span className="flex items-center gap-2.5">
                    <CategoryIcon id={category.id} className="h-5 w-5 text-accent" />
                    <span className="text-lg font-semibold tracking-tight text-text">
                      {tc(category.id)}
                    </span>
                  </span>
                  <span className="text-sm text-muted">
                    {t("categoryToolsCount", { count: categoryTools.length })}
                  </span>
                </button>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}