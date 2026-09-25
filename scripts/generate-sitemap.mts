import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { categories, tools } from "../data/tools.ts";
import { guides } from "../data/guides.ts";
import { categoryUrl, siteUrl, toolUrl } from "../lib/paths.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(here, "../public/sitemap.xml");

/**
 * <lastmod> icin kaynak dosyalarinin son commit tarihi. Google'a "bu sayfa
 * ne zaman degisti" bilgisini verir ve yeniden tarama kararini etkiler.
 * Git yoksa (ornegin .git'siz arsiv) script'in calistigi tarihe dusuyoruz.
 */
function lastCommitDate(paths: string[]): string {
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...paths],
      { cwd: resolve(here, ".."), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    return out || new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

const now = new Date().toISOString();
const homeLastMod = lastCommitDate([
  "app/[locale]/page.tsx",
  "data/tools.ts",
  "messages/en.json",
]);
const categoryLastMod = lastCommitDate(["data/tools.ts"]);
const toolLastMod = lastCommitDate(["data/tools.ts", "components/tools"]);
const guideLastMod = lastCommitDate(["data/guides.ts"]);
const staticLastMod = lastCommitDate([
  "app/[locale]/about/page.tsx",
  "app/[locale]/contact/page.tsx",
  "app/[locale]/privacy-policy/page.tsx",
]);

const homeEn = `${siteUrl}/`;
const homeTr = `${siteUrl}/tr`;
const guidesEn = `${siteUrl}/rehber`;
const guidesTr = `${siteUrl}/tr/rehber`;

type Entry = {
  loc: string;
  en: string;
  tr: string;
  changefreq: string;
  priority: string;
  lastmod: string;
};

const entries: Entry[] = [
  {
    loc: homeEn,
    en: homeEn,
    tr: homeTr,
    changefreq: "weekly",
    priority: "1.0",
    lastmod: homeLastMod,
  },
  {
    loc: homeTr,
    en: homeEn,
    tr: homeTr,
    changefreq: "weekly",
    priority: "1.0",
    lastmod: homeLastMod,
  },
  {
    loc: guidesEn,
    en: guidesEn,
    tr: guidesTr,
    changefreq: "monthly",
    priority: "0.8",
    lastmod: guideLastMod,
  },
  // Kategoriler her iki dilde de tek basina indekslenebilir sayfalar, bu yuzden
  // EN ve TR ayri <url> girdisi olarak yaziliyor. (Arac ve rehberler de ayni
  // sekilde iki girdi aliyor.)
  ...categories.flatMap((category) => [
    {
      loc: categoryUrl("en", category.id),
      en: categoryUrl("en", category.id),
      tr: categoryUrl("tr", category.id),
      changefreq: "weekly" as const,
      priority: "0.9",
      lastmod: categoryLastMod,
    },
    {
      loc: categoryUrl("tr", category.id),
      en: categoryUrl("en", category.id),
      tr: categoryUrl("tr", category.id),
      changefreq: "weekly" as const,
      priority: "0.9",
      lastmod: categoryLastMod,
    },
  ]),
  ...tools.flatMap((tool) => [
    {
      loc: toolUrl("en", tool.slug),
      en: toolUrl("en", tool.slug),
      tr: toolUrl("tr", tool.slug),
      changefreq: "monthly" as const,
      priority: "0.8",
      lastmod: toolLastMod,
    },
    {
      loc: toolUrl("tr", tool.slug),
      en: toolUrl("en", tool.slug),
      tr: toolUrl("tr", tool.slug),
      changefreq: "monthly" as const,
      priority: "0.8",
      lastmod: toolLastMod,
    },
  ]),
  ...guides.flatMap((guide) => [
    {
      loc: `${siteUrl}/rehber/${guide.slug}`,
      en: `${siteUrl}/rehber/${guide.slug}`,
      tr: `${siteUrl}/tr/rehber/${guide.slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
      lastmod: guideLastMod,
    },
    {
      loc: `${siteUrl}/tr/rehber/${guide.slug}`,
      en: `${siteUrl}/rehber/${guide.slug}`,
      tr: `${siteUrl}/tr/rehber/${guide.slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
      lastmod: guideLastMod,
    },
  ]),
  ...["about", "contact", "privacy-policy"].flatMap((page) => [
    {
      loc: `${siteUrl}/${page}`,
      en: `${siteUrl}/${page}`,
      tr: `${siteUrl}/tr/${page}`,
      changefreq: "yearly" as const,
      priority: "0.3",
      lastmod: staticLastMod,
    },
    {
      loc: `${siteUrl}/tr/${page}`,
      en: `${siteUrl}/${page}`,
      tr: `${siteUrl}/tr/${page}`,
      changefreq: "yearly" as const,
      priority: "0.3",
      lastmod: staticLastMod,
    },
  ]),
  {
    loc: guidesTr,
    en: guidesEn,
    tr: guidesTr,
    changefreq: "monthly",
    priority: "0.8",
    lastmod: guideLastMod,
  },
];

const body = entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
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
console.log(`lastmod kaynak tarihi: ${homeLastMod}`);
if (homeLastMod === now) {
  console.log("  NOT: git tarihi alinamadi, build zamani kullanildi");
}
