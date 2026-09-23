"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ToolIcon from "@/components/ToolIcon";
import { categoryTheme } from "@/components/categoryTheme";
import type { Tool } from "@/data/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  const t = useTranslations(`ToolMeta.${tool.slug}`);
  const tc = useTranslations("Categories");
  const common = useTranslations("Common");
  const theme = categoryTheme(tool.category);

  return (
    <Link
      href={`/araclar/${tool.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover ${theme.hoverBorder} fade-in-up`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-xl ${theme.strip}`}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 flex w-[30%] items-center justify-center opacity-10 transition-opacity duration-200 group-hover:opacity-20"
      >
        <ToolIcon id={tool.slug} className={`h-28 w-28 rotate-6 ${theme.iconText}`} />
      </span>
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${theme.iconBg}`}
          >
            <ToolIcon id={tool.slug} className={`h-5 w-5 ${theme.iconText}`} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold leading-snug tracking-tight text-text">
              {t("name")}
            </h3>
            <span
              className={`mt-1 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium ${theme.iconText}`}
            >
              {tc(tool.category)}
            </span>
          </div>
        </div>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {t("desc")}
        </p>
        <span className="btn-accent mt-4 inline-flex w-fit items-center rounded-lg px-3 py-1.5 text-xs font-medium text-on-accent transition-transform duration-200 group-hover:translate-x-0.5">
          {common("use")}
        </span>
      </div>
    </Link>
  );
}