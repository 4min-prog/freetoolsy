import type { MetadataRoute } from "next";
import { tools, categories } from "@/data/tools";
import { guides } from "@/data/guides";
import { siteUrl, categoryPath, toolPath } from "@/lib/paths";
import { routing, type Locale } from "@/i18n/routing";

export const revalidate = 86400;

const staticPages: {
  internal: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}[] = [
  { internal: "/", priority: 1, changeFrequency: "weekly" },
  { internal: "/about", priority: 0.6, changeFrequency: "monthly" },
  { internal: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { internal: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { internal: "/rehber", priority: 0.8, changeFrequency: "weekly" },
];

function localeUrl(locale: Locale, internal: string) {
  const path = internal.startsWith("/") ? internal : `/${internal}`;
  if (locale === "en") return `${siteUrl}${path}`;
  return path === "/" ? `${siteUrl}/tr` : `${siteUrl}/tr${path}`;
}

function pageEntry(
  locale: Locale,
  internal: (l: Locale) => string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified: Date
): MetadataRoute.Sitemap[number] {
  const languages = {
    en: localeUrl("en", internal("en")),
    tr: localeUrl("tr", internal("tr")),
    "x-default": localeUrl("en", internal("en")),
  };
  return {
    url: localeUrl(locale, internal(locale)),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const page of staticPages) {
      entries.push(
        pageEntry(
          locale,
          () => page.internal,
          page.priority,
          page.changeFrequency,
          lastModified
        )
      );
    }

    for (const guide of guides) {
      entries.push(
        pageEntry(
          locale,
          () => `/rehber/${guide.slug}`,
          0.6,
          "monthly",
          lastModified
        )
      );
    }

    for (const category of categories) {
      entries.push(
        pageEntry(
          locale,
          (l) => categoryPath(l, category.id),
          0.7,
          "weekly",
          lastModified
        )
      );
    }

    for (const tool of tools) {
      entries.push(
        pageEntry(
          locale,
          (l) => toolPath(l, tool.slug),
          0.6,
          "weekly",
          lastModified
        )
      );
    }
  }

  return entries;
}