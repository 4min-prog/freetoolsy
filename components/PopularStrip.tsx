"use client";

import { useEffect, useRef } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ToolIcon from "@/components/ToolIcon";
import { categoryTheme } from "@/components/categoryTheme";
import { POPULAR_SLUGS } from "@/data/popular";
import { getTool } from "@/data/tools";
import { track } from "@/lib/analytics";
import { toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface ToolMetaNs {
  name?: string;
}

export default function PopularStrip() {
  const t = useTranslations("Home");
  const tc = useTranslations("Categories");
  const locale = useLocale() as Locale;
  const messages = useMessages();
  const meta = (messages as { ToolMeta?: Record<string, ToolMetaNs> })
    .ToolMeta;

  const items = POPULAR_SLUGS.map((slug) => getTool(slug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))
    .slice(0, 8);

  function onClick(slug: string) {
    track("popular_click", { tool_slug: slug });
  }

  const tickerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    const source = Array.from(el.children) as HTMLElement[];
    for (const li of source) {
      const clone = li.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("data-ticker-clone", "");
      clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
      el.appendChild(clone);
    }
    return () => {
      el.querySelectorAll("[data-ticker-clone]").forEach((n) => n.remove());
    };
  }, []);

  return (
    <section aria-label={t("popularTitle")} className="mt-10 border-y border-border">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
          {t("popularTitle")}
        </h2>
        <p className="text-xs text-muted">{t("popularSubtitle")}</p>
      </div>
      <div className="popular-ticker-track popular-ticker-mask overflow-hidden border-t border-border">
        <ul className="popular-ticker" ref={tickerRef}>
          {items.map((tool, index) => {
            const toolName = meta?.[tool.slug]?.name ?? tool.slug;
            const theme = categoryTheme(tool.category);
            return (
              <li key={`${tool.slug}-${index}`} className="shrink-0">
                <Link
                  href={toolPath(locale, tool.slug)}
                  onClick={() => onClick(tool.slug)}
                  className="group relative mr-4 flex min-h-14 items-center gap-3 overflow-hidden border-r border-border px-5 py-3 transition-colors hover:bg-surface-2 active:bg-surface-2"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 flex w-[30%] items-center justify-center opacity-10 transition-opacity duration-200 group-hover:opacity-20"
                  >
                    <ToolIcon
                      id={tool.slug}
                      className={`h-28 w-28 rotate-6 ${theme.iconText}`}
                    />
                  </span>
                  <span className="relative z-10 flex items-center gap-3">
                    <ToolIcon
                      id={tool.slug}
                      className={`h-5 w-5 shrink-0 ${theme.iconText}`}
                    />
                  </span>
                  <span className="relative z-10 whitespace-nowrap text-sm font-medium text-text">
                    {toolName}
                  </span>
                  <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                    {tc(tool.category)}
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    aria-hidden="true"
                    className="relative z-10 h-3.5 w-3.5 shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}