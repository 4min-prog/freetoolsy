import JsonLd from "./JsonLd";
import { getTranslations } from "next-intl/server";
import { getTool } from "@/data/tools";

export default async function ToolFaqJsonLd({ slug }: { slug: string }) {
  const tool = getTool(slug);
  if (!tool) return null;

  const t = await getTranslations(`ToolMeta.${slug}`);
  const tf = await getTranslations("Faq");
  const name = t("name");

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: tf("whatIs", { name }),
            acceptedAnswer: { "@type": "Answer", text: t("desc") },
          },
          {
            "@type": "Question",
            name: tf("howTo", { name }),
            acceptedAnswer: { "@type": "Answer", text: tf("howToAnswer") },
          },
          {
            "@type": "Question",
            name: tf("isFree", { name }),
            acceptedAnswer: {
              "@type": "Answer",
              text: tf("isFreeAnswer", { name }),
            },
          },
        ],
      }}
    />
  );
}