import { getTranslations } from "next-intl/server";
import { getTool } from "@/data/tools";

export default async function ToolFaq({ slug }: { slug: string }) {
  const tool = getTool(slug);
  if (!tool) return null;

  const t = await getTranslations(`ToolMeta.${slug}`);
  const tf = await getTranslations("Faq");
  const name = t("name");
  const items = [
    { q: tf("whatIs", { name }), a: t("desc") },
    { q: tf("howTo", { name }), a: tf("howToAnswer") },
    { q: tf("isFree", { name }), a: tf("isFreeAnswer", { name }) },
  ];

  return (
    <section className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-card">
      <h2 className="text-base font-semibold tracking-tight text-text">
        {tf("title")}
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.q} className="rounded-lg border border-border bg-bg px-4 py-3">
            <h3 className="text-sm font-medium text-text">{item.q}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.a}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}