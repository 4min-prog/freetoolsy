import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { categories, tools } from "../data/tools.ts";
import { guides } from "../data/guides.ts";
import { categoryUrl, siteUrl, toolUrl } from "../lib/paths.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(here, "../public/sitemap.xml");

const homeEn = `${siteUrl}/`;
const homeTr = `${siteUrl}/tr`;
const guidesEn = `${siteUrl}/rehber`;
const guidesTr = `${siteUrl}/tr/rehber`;

type Entry = { loc: string; en: string; tr: string; changefreq: string; priority: string };

const entries: Entry[] = [
  { loc: homeEn, en: homeEn, tr: homeTr, changefreq: "weekly", priority: "1.0" },
  { loc: guidesEn, en: guidesEn, tr: guidesTr, changefreq: "monthly", priority: "0.8" },
  ...categories.map((category) => ({
    loc: categoryUrl("en", category.id),
    en: categoryUrl("en", category.id),
    tr: categoryUrl("tr", category.id),
    changefreq: "weekly" as const,
    priority: "0.9",
  })),
  ...tools.map((tool) => ({
    loc: toolUrl("en", tool.slug),
    en: toolUrl("en", tool.slug),
    tr: toolUrl("tr", tool.slug),
    changefreq: "monthly" as const,
    priority: "0.8",
  })),
  ...guides.map((guide) => ({
    loc: `${siteUrl}/rehber/${guide.slug}`,
    en: `${siteUrl}/rehber/${guide.slug}`,
    tr: `${siteUrl}/tr/rehber/${guide.slug}`,
    changefreq: "monthly" as const,
    priority: "0.6",
  })),
  ...["about", "contact", "privacy-policy"].map((page) => ({
    loc: `${siteUrl}/${page}`,
    en: `${siteUrl}/${page}`,
    tr: `${siteUrl}/tr/${page}`,
    changefreq: "yearly" as const,
    priority: "0.3",
  })),
];

const body = entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${entry.en}" />
    <xhtml:link rel="alternate" hreflang="tr" href="${entry.tr}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${entry.en}" />
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

writeFileSync(outputPath, xml, "utf8");

console.log(
  `sitemap.xml yazildi: ${entries.length} URL (${tools.length} arac, ${categories.length} kategori, ${guides.length} rehber)`
);
