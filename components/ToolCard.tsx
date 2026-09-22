"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ToolIcon from "@/components/ToolIcon";
import type { Tool } from "@/data/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  const t = useTranslations(`ToolMeta.${tool.slug}`);
  const tc = useTranslations("Categories");
  const common = useTranslations("Common");

  return (
    <Link
      href={`/araclar/${tool.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-card-hover"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 flex w-[30%] items-center justify-center text-accent opacity-15 transition-opacity duration-200 group-hover:opacity-25"
      >
        <ToolIcon id={tool.slug} className="h-28 w-28 rotate-6" />
      </span>
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-[15px] font-semibold leading-snug tracking-tight text-text">
            {t("name")}
          </h3>
          <span className="shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted transition-colors group-hover:text-accent">
            {tc(tool.category)}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {t("desc")}
        </p>
        <span className="mt-4 inline-flex w-fit items-center rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-on-accent transition-transform duration-200 group-hover:translate-x-0.5">
          {common("use")}
        </span>
      </div>
    </Link>
  );
}