"use client";

import { useLocale, useMessages, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ToolIcon from "@/components/ToolIcon";
import { POPULAR_SLUGS } from "@/data/popular";
import { getTool } from "@/data/tools";
import { track } from "@/lib/analytics";
import { toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";

interface ToolMetaNs {
  name?: string;
}

export default function PopularStrip() {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;
  const messages = useMessages();
  const meta = (messages as { ToolMeta?: Record<string, ToolMetaNs> })
    .ToolMeta;

  const items = POPULAR_SLUGS.filter((slug) => getTool(slug)).slice(0, 8);

  function onClick(slug: string) {
    track("popular_click", { tool_slug: slug });
  }

  return (
    <section aria-label={t("popularTitle")} className="mt-10 border-y border-border">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
          {t("popularTitle")}
        </h2>
        <p className="text-xs text-muted">{t("popularSubtitle")}</p>
      </div>
      <div className="popular-ticker-track popular-ticker-mask overflow-hidden border-t border-border">
        <ul className="popular-ticker">
          {[...items, ...items].map((slug, index) => {
            const toolName = meta?.[slug]?.name ?? slug;
            return (
              <li key={`${slug}-${index}`} className="shrink-0">
                <Link
                  href={toolPath(locale, slug)}
                  onClick={() => onClick(slug)}
                  className="group flex items-center gap-3 border-r border-border px-6 py-4 transition-colors hover:bg-surface/60"
                >
                  <span className="font-mono text-[11px] tabular-nums text-faint">
                    {String((index % items.length) + 1).padStart(2, "0")}
                  </span>
                  <ToolIcon
                    id={slug}
                    className="h-4 w-4 shrink-0 text-accent"
                  />
                  <span className="whitespace-nowrap text-sm font-medium text-text">
                    {toolName}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}