import JsonLd from "./JsonLd";
import { getTool } from "@/data/tools";

export default function ToolJsonLd({ slug }: { slug: string }) {
  const tool = getTool(slug);
  if (!tool) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        url: `https://freetoolsy.vercel.app/araclar/${tool.slug}`,
        description: tool.description,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
        inLanguage: "tr",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "TRY",
        },
      }}
    />
  );
}