import { getTool, tools, type Tool } from "@/data/tools";

export const POPULAR_SLUGS: string[] = [
  "json-formatter",
  "password-generator",
  "qr-code-generator",
  "word-counter",
  "character-counter",
  "image-compressor",
  "vat-calculator",
  "base64",
  "bmi-calculator",
  "percentage-calculator",
  "sha-hash-generator",
  "text-sorter",
];

export function getPopularTools(): Tool[] {
  return POPULAR_SLUGS.map((slug) => getTool(slug)).filter(
    (tool): tool is Tool => Boolean(tool)
  );
}

export function getNewestTools(): Tool[] {
  const dated = tools.filter((tool) => Boolean(tool.addedAt));
  return dated.sort(
    (a, b) => (b.addedAt ?? "").localeCompare(a.addedAt ?? "")
  );
}