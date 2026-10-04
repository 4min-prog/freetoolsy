import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["en", "tr"] as const;
const output: Record<string, unknown> = {};

type LocalizedMessages = {
  ToolMeta?: Record<string, { name?: string; pageDesc?: string }>;
  Categories?: Record<string, string>;
  CategoryPage?: {
    desc?: Record<string, string>;
    seoContent?: Record<string, { description?: string }>;
  };
};

for (const locale of locales) {
  const messages = JSON.parse(
    readFileSync(resolve(root, "messages", `${locale}.json`), "utf8")
  ) as LocalizedMessages;
  const toolMeta = Object.fromEntries(
    Object.entries(messages.ToolMeta ?? {}).map(([slug, metadata]) => [
      slug,
      { name: metadata.name, pageDesc: metadata.pageDesc },
    ])
  );
  const seoContent = Object.fromEntries(
    Object.entries(messages.CategoryPage?.seoContent ?? {}).map(
      ([id, content]) => [id, { description: content.description }]
    )
  );

  output[locale] = {
    ToolMeta: toolMeta,
    Categories: messages.Categories,
    CategoryPage: {
      desc: messages.CategoryPage?.desc ?? {},
      seoContent,
    },
  };
}

writeFileSync(
  resolve(root, "data", "og-messages.json"),
  `${JSON.stringify(output)}\n`
);
