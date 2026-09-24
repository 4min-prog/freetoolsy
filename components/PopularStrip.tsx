"use client";

import { useMessages, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ToolIcon from "@/components/ToolIcon";
import { POPULAR_SLUGS } from "@/data/popular";
import { getTool, tools } from "@/data/tools";
import { track } from "@/lib/analytics";

interface ToolMetaNs {
  name?: string;
}

export default function PopularStrip() {
  const t = useTranslations("Home");
  const messages = useMessages();
  const meta = (messages as { ToolMeta?: Record<string, ToolMetaNs> })
    .ToolMeta;

  const items = POPULAR_SLUGS.filter((slug) => getTool(slug)).slice(0, 8);

  function onClick(slug: string) {
    track("popular_click", { tool_slug: slug });
  }

  return (
    <section
      aria-label={t("popularTitle")}
      className="mt-6 rounded-2xl border border-border bg-surface/60 p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-sm font-semibold tracking-tight text-text">
          {t("popularTitle")}
        </p>
        <p className="text-xs text-muted">{t("popularSubtitle")}</p>
        <span aria-hidden="true" className="ml-auto hidden text-faint sm:inline">
          {tools.length} {t("statsTools")}
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((slug, index) => {
          const toolName = meta?.[slug]?.name ?? slug;
          return (
            <li key={slug}>
              <Link
                href={`/araclar/${slug}`}
                onClick={() => onClick(slug)}
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-accent/40 hover:text-text"
              >
                <span className="shrink-0 font-mono text-[11px] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ToolIcon id={slug} className="h-4 w-4 shrink-0 text-accent" />
                <span className="truncate">{toolName}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}