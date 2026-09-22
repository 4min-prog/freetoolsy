import Link from "next/link";
import type { Tool } from "@/data/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/araclar/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-text">
          {tool.name}
        </h3>
        <span className="shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted transition-colors group-hover:text-accent">
          {tool.category}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {tool.description}
      </p>
      <span className="mt-4 inline-flex w-fit items-center rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-on-accent transition-transform duration-200 group-hover:translate-x-0.5">
        Kullan
      </span>
    </Link>
  );
}