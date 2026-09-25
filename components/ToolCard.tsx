"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import ToolIcon from "@/components/ToolIcon";
import { categoryTheme } from "@/components/categoryTheme";
import type { Tool } from "@/data/tools";
import { toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";

export default function ToolCard({ tool }: { tool: Tool }) {
  const t = useTranslations(`ToolMeta.${tool.slug}`);
  const locale = useLocale() as Locale;
  const tc = useTranslations("Categories");
  const theme = categoryTheme(tool.category);

  return (
    <Link
      href={toolPath(locale, tool.slug)}
      className={`group relative flex flex-col overflow-hidden border border-border bg-surface p-4 transition-colors hover:bg-surface-2 active:bg-surface-2 sm:p-5 ${theme.hoverBorder}`}
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

      <div className="relative z-10 flex items-start gap-3">
        <ToolIcon
          id={tool.slug}
          className={`mt-0.5 h-5 w-5 shrink-0 ${theme.iconText}`}
        />
        <h3 className="min-w-0 flex-1 text-[15px] font-medium leading-snug tracking-tight text-foreground">
          {t("name")}
        </h3>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>

      <span className="relative z-10 mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        {tc(tool.category)}
      </span>

      <p className="relative z-10 mt-3 flex-1 text-sm leading-relaxed text-muted">
        {t("desc")}
      </p>
    </Link>
  );
}
