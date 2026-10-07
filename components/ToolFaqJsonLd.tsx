import JsonLd from "./JsonLd";
import { getMessages, getTranslations } from "next-intl/server";
import { getTool } from "@/data/tools";
import { toolFaqItems, type ToolContentBlock } from "@/lib/faq";

export default async function ToolFaqJsonLd({ slug }: { slug: string }) {
  const tool = getTool(slug);
  if (!tool) return null;

  const t = await getTranslations(`ToolMeta.${slug}`);
  const tf = await getTranslations("Faq");
  const messages = await getMessages();
  const name = t("name");
  const contents = (messages.ToolContent ?? {}) as unknown as Record<
    string,
    ToolContentBlock[]
  >;
  const items = toolFaqItems(contents[slug] ?? [], [
    { q: tf("whatIs", { name }), a: t("desc") },
    { q: tf("howTo", { name }), a: tf("howToAnswer") },
    { q: tf("isFree", { name }), a: tf("isFreeAnswer", { name }) },
  ]);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}
