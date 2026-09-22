"use client";

import { useMemo, useRef, useState } from "react";
import ToolCard from "@/components/ToolCard";
import CategoryIcon from "@/components/CategoryIcon";
import { categories, getToolsByCategory, tools } from "@/data/tools";

export default function ToolExplorer() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const normalized = query.toLocaleLowerCase("tr-TR").trim();

  const filtered = useMemo(() => {
    if (!normalized) return null;
    return tools.filter((tool) =>
      [tool.name, tool.slug, tool.category, tool.description]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalized)
    );
  }, [normalized]);

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
          Araç ara
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
            placeholder="Araç ara… örn. şifre, JSON, KDV"
            className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-text placeholder:text-faint shadow-card transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {filtered ? (
        <section className="mt-10" aria-live="polite">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h2 className="text-lg font-semibold tracking-tight text-text">
              Sonuçlar
            </h2>
            <span className="text-sm text-muted">{filtered.length} araç</span>
          </div>
          {filtered.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted">
              &quot;{query}&quot; için eşleşen araç bulunamadı. Farklı bir
              anahtar kelime deneyin.
            </p>
          )}
        </section>
      ) : (
        <div className="mt-12 space-y-14">
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.name);
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
                      {category.name}
                    </span>
                  </span>
                  <span className="text-sm text-muted">
                    {categoryTools.length} araç
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