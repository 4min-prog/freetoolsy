import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import ToolIcon from "@/components/ToolIcon";
import { getTool, popularTools } from "@/data/tools";

export default async function PopularTools() {
  const t = await getTranslations("Home");
  const entries = popularTools
    .map((slug) => ({ slug, tool: getTool(slug) }))
    .filter((entry) => entry.tool);

  const names = await Promise.all(
    entries.map((entry) =>
      getTranslations(`ToolMeta.${entry.slug}`).then((tt) => tt("name"))
    )
  );

  return (
    <section className="pb-8" aria-label={t("popularTitle")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-text">{t("popularTitle")}</span>
        {entries.map((entry, index) => (
          <Link
            key={entry.slug}
            href={`/araclar/${entry.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted shadow-card transition-colors hover:border-accent hover:text-accent"
          >
            <ToolIcon id={entry.slug} className="h-3.5 w-3.5" />
            {names[index]}
          </Link>
        ))}
      </div>
    </section>
  );
}