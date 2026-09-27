import { tools, categories } from "../data/tools.ts";
import { guides } from "../data/guides.ts";
import { siteUrl } from "../lib/paths.ts";
import type { Locale } from "../i18n/routing.ts";

const KEY = "f2155e5599074f31b70fed1cd0ffecb6";
const HOST = "www.freetoolsy.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";

function url(locale: Locale, internal: string): string {
  if (locale === "en") return `${siteUrl}${internal}`;
  return internal === "/" ? `${siteUrl}/tr` : `${siteUrl}/tr${internal}`;
}

const staticPaths = ["/", "/about", "/contact", "/privacy-policy", "/rehber"];

const urlList = [
  ...["en", "tr"].flatMap((locale) =>
    staticPaths.map((p) => url(locale as Locale, p))
  ),
  ...["en", "tr"].flatMap((locale) =>
    guides.map((guide) => url(locale as Locale, `/rehber/${guide.slug}`))
  ),
  ...tools.map((tool) => url("en", `/tools/${tool.slug}`)),
  ...tools.map((tool) => url("tr", `/araclar/${tool.slug}`)),
  ...categories.map((category) => url("en", `/categories/${category.id}`)),
  ...categories.map((category) => url("tr", `/kategoriler/${category.id}`)),
];

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `${siteUrl}/${KEY}.txt`,
  urlList,
};

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(
    `IndexNow: ${res.status} (${urlList.length} URLs) ${await res.text()}`
  );
} catch (error) {
  console.error("IndexNow failed:", error);
  process.exitCode = 1;
}