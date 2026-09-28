/**
 * Tum tool kayitlarinin butunlugu denetleyicisi.
 *
 * Yeni tool eklerken en sik yapilan hata su olur: data/tools.ts'e slug eklenir
 * (sitemap'e girer, kategoriye girer) ama bilesen registry'si, ceviri
 * sozlugu veya ToolMeta eklenmez. Sonuc: sayfa 200 doner ama arac calismaz.
 * Build bunu yakalamaz. Bu betik yakalar.
 *
 * Kapsam: tool kaydi, bilesen registry'si (statik + dinamik), ToolMeta alanlari,
 * ToolContent blogu, ceviri ad alani, ikon, ornek veri, kategori ikonu, rehber
 * blok esitligi ve rehber relatedTools baglantilari.
 *
 * Kullanim: npm run check:tools
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { categories, tools } from "../data/tools.ts";
import { DYNAMIC_TOOL_SLUGS } from "../data/dynamicTools.ts";
import { guides } from "../data/guides.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const META_KEYS = ["name", "desc", "title", "pageDesc", "intro"] as const;
const LOCALES = ["en", "tr"] as const;
const errors: string[] = [];
const warnings: string[] = [];
const withoutSample: string[] = [];

function read(file: string) {
  return readFileSync(resolve(root, file), "utf8");
}

function keysFrom(source: string, pattern: RegExp) {
  return [...new Set([...source.matchAll(pattern)].map((match) => match[1]))];
}

const registeredComponents = new Set(
  keysFrom(read("data/toolComponents.ts"), /"([a-z0-9-]+)":\s*dynamic\(/g)
);
const namespaceMap = new Map(
  [...read("data/toolCompNamespaces.ts").matchAll(/"([a-z0-9-]+)":\s*"([A-Za-z0-9_]+)"/g)].map(
    (match) => [match[1], match[2]]
  )
);
const sampleKeys = new Set(
  keysFrom(read("data/samples.ts"), /^ {2}"([a-z0-9-]+)":/gm)
);
const iconKeys = new Set(
  keysFrom(read("components/ToolIcon.tsx"), /^\s*"?([a-z0-9-]+)"?:\s*fa[A-Za-z]+/gm)
);
const categoryIconKeys = new Set(
  keysFrom(read("components/CategoryIcon.tsx"), /^ {2}([a-z0-9-]+): \(/gm)
);

const messages: Record<string, any> = {};
for (const locale of LOCALES) {
  messages[locale] = JSON.parse(read(`messages/${locale}.json`));
}

const seen = new Set<string>();
const categoryIds = new Set(categories.map((category) => category.id));

for (const category of categories) {
  if (!categoryIconKeys.has(category.id)) {
    errors.push(`kategori ${category.id}: components/CategoryIcon.tsx icinde ikon yok`);
  }
}

for (const tool of tools) {
  const { slug, name, category, description } = tool;

  if (seen.has(slug)) errors.push(`${slug}: data/tools.ts icinde yinelenen slug`);
  seen.add(slug);

  if (!/^[a-z0-9-]+$/.test(slug)) errors.push(`${slug}: slug formati yanlis (kucuk harf, rakam, tire)`);
  if (!name?.trim()) errors.push(`${slug}: tools.ts name bos`);
  if (!description?.trim()) errors.push(`${slug}: tools.ts description bos`);
  if (!categoryIds.has(category)) errors.push(`${slug}: bilinmeyen kategori "${category}"`);

  const hasComponent = registeredComponents.has(slug) || DYNAMIC_TOOL_SLUGS.has(slug);
  if (!hasComponent) {
    errors.push(
      `${slug}: hicbir yerde bilesen kaydi yok (toolComponents.ts veya DYNAMIC_TOOL_SLUGS)`
    );
  }

  for (const locale of LOCALES) {
    const localeMessages = messages[locale];
    const meta = localeMessages.ToolMeta?.[slug];
    if (!meta) {
      errors.push(`${slug}: messages/${locale}.json icinde ToolMeta.${slug} yok`);
    } else {
      for (const key of META_KEYS) {
        if (!meta[key]?.trim()) {
          errors.push(`${slug}: ToolMeta.${slug}.${key} bos veya eksik (${locale})`);
        }
      }
    }

    const content = localeMessages.ToolContent?.[slug];
    if (!Array.isArray(content) || content.length === 0) {
      errors.push(`${slug}: ToolContent.${slug} eksik veya bos (${locale})`);
    } else {
      content.forEach((block: any, index: number) => {
        if (typeof block !== "object" || block === null) {
          errors.push(`${slug}: ToolContent.${slug}[${index}] nesne degil (${locale})`);
          return;
        }
        if (!block.h?.trim()) {
          errors.push(`${slug}: ToolContent.${slug}[${index}].h bos (${locale})`);
        }
        const hasParagraph = typeof block.p === "string" && block.p.trim();
        const hasList = Array.isArray(block.list) && block.list.some((item: unknown) => item?.trim());
        if (!hasParagraph && !hasList) {
          errors.push(`${slug}: ToolContent.${slug}[${index}] p/list bos (${locale})`);
        }
        if (Array.isArray(block.list) && block.list.some((item: unknown) => !item?.trim())) {
          errors.push(`${slug}: ToolContent.${slug}[${index}].list icinde bos madde var (${locale})`);
        }
      });
    }
  }

  const enBlocks = messages.en.ToolContent?.[slug];
  const trBlocks = messages.tr.ToolContent?.[slug];
  if (Array.isArray(enBlocks) && Array.isArray(trBlocks) && enBlocks.length !== trBlocks.length) {
    errors.push(`${slug}: ToolContent blogu sayisi esit degil (en ${enBlocks.length} / tr ${trBlocks.length})`);
  }

  const namespace = namespaceMap.get(slug);
  if (namespace) {
    if (!hasComponent) {
      errors.push(`${slug}: ceviri ad alani var ama bilesen registry'sinde yok`);
    }
    for (const locale of LOCALES) {
      if (!messages[locale].comp?.[namespace]) {
        errors.push(`${slug}: comp.${namespace} sozlugu messages/${locale}.json icinde yok`);
      }
    }
  } else if (hasComponent) {
    errors.push(`${slug}: toolCompNamespaces.ts icinde ceviri ad alani eksik`);
  }

  if (!iconKeys.has(slug)) errors.push(`${slug}: ToolIcon tablosunda ikon yok`);
  if (!sampleKeys.has(slug)) withoutSample.push(slug);
}

const namespaceOwners = new Map<string, string>();
for (const [slug, namespace] of namespaceMap) {
  const owner = namespaceOwners.get(namespace);
  if (owner) {
    errors.push(`comp.${namespace}: hem ${owner} hem ${slug} ayni ad alanini kullaniyor`);
  } else {
    namespaceOwners.set(namespace, slug);
  }
}

for (const slug of registeredComponents) {
  if (!seen.has(slug)) errors.push(`${slug}: toolComponents.ts'te var ama data/tools.ts'te yok`);
}
for (const slug of DYNAMIC_TOOL_SLUGS) {
  if (!seen.has(slug)) errors.push(`${slug}: DYNAMIC_TOOL_SLUGS'te var ama data/tools.ts'te yok`);
}
for (const slug of namespaceMap.keys()) {
  if (!seen.has(slug)) errors.push(`${slug}: toolCompNamespaces.ts'te var ama data/tools.ts'te yok`);
}
for (const slug of sampleKeys) {
  if (!seen.has(slug)) errors.push(`${slug}: data/samples.ts icinde var ama data/tools.ts'te yok`);
}
for (const slug of iconKeys) {
  if (!seen.has(slug)) warnings.push(`${slug}: ToolIcon tablosunda ama data/tools.ts'te yok`);
}
for (const locale of LOCALES) {
  for (const slug of Object.keys(messages[locale].ToolContent ?? {})) {
    if (!seen.has(slug)) errors.push(`ToolContent.${slug}: messages/${locale}.json icinde var ama data/tools.ts'te yok`);
  }
  for (const [namespace, value] of Object.entries(messages[locale].comp ?? {})) {
    if (!namespaceOwners.has(namespace)) {
      warnings.push(`comp.${namespace}: messages/${locale}.json icinde var ama toolCompNamespaces.ts'te yok`);
    }
    if (value && typeof value === "object" && Object.keys(value).length === 0) {
      errors.push(`comp.${namespace}: messages/${locale}.json icinde bos`);
    }
  }
}

const enSlugs = Object.keys(messages.en.ToolMeta ?? {});
const trSlugs = Object.keys(messages.tr.ToolMeta ?? {});
for (const slug of enSlugs) {
  if (!trSlugs.includes(slug)) errors.push(`ToolMeta.${slug}: tr.json'da eksik`);
}
for (const slug of trSlugs) {
  if (!enSlugs.includes(slug)) errors.push(`ToolMeta.${slug}: en.json'da eksik`);
}

const guideSlugs = new Set<string>();
for (const guide of guides) {
  if (guideSlugs.has(guide.slug)) errors.push(`rehber ${guide.slug}: yinelenen slug`);
  guideSlugs.add(guide.slug);

  if (!/^[a-z0-9-]+$/.test(guide.slug)) errors.push(`rehber ${guide.slug}: slug formati yanlis`);

  for (const locale of LOCALES) {
    const localized = guide.content?.[locale];
    if (!localized) {
      errors.push(`rehber ${guide.slug}: content.${locale} eksik`);
      continue;
    }
    for (const key of ["title", "desc", "intro"] as const) {
      if (!localized[key]?.trim()) {
        errors.push(`rehber ${guide.slug}: content.${locale}.${key} bos veya eksik`);
      }
    }
    if (!Array.isArray(localized.blocks) || localized.blocks.length === 0) {
      errors.push(`rehber ${guide.slug}: content.${locale}.blocks bos`);
    } else {
      localized.blocks.forEach((block, index) => {
        if (!block?.h2?.trim()) {
          errors.push(`rehber ${guide.slug}: content.${locale}.blocks[${index}].h2 bos`);
        }
        if (!Array.isArray(block?.paragraphs) || block.paragraphs.length === 0) {
          errors.push(`rehber ${guide.slug}: content.${locale}.blocks[${index}].paragraphs bos`);
        } else {
          block.paragraphs.forEach((paragraph, pIndex) => {
            if (!paragraph?.trim()) {
              errors.push(`rehber ${guide.slug}: content.${locale}.blocks[${index}].paragraphs[${pIndex}] bos`);
            }
          });
        }
        if (block?.bullets?.some((bullet) => !bullet?.trim())) {
          errors.push(`rehber ${guide.slug}: content.${locale}.blocks[${index}].bullets icinde bos madde var`);
        }
      });
    }
  }

  const enBlocks = guide.content?.en?.blocks;
  const trBlocks = guide.content?.tr?.blocks;
  if (Array.isArray(enBlocks) && Array.isArray(trBlocks) && enBlocks.length !== trBlocks.length) {
    errors.push(`rehber ${guide.slug}: blok sayisi esit degil (en ${enBlocks.length} / tr ${trBlocks.length})`);
  }

  for (const related of guide.relatedTools ?? []) {
    if (!seen.has(related)) {
      errors.push(`rehber ${guide.slug}: relatedTools icindeki "${related}" bilinmeyen tool`);
    }
  }
}

console.log(`tools.ts: ${tools.length} tool  |  bilesen: ${registeredComponents.size}  |  ssr:false: ${DYNAMIC_TOOL_SLUGS.size}  |  ikon: ${iconKeys.size}`);
console.log(`kategori: ${categories.length}  |  rehber: ${guides.length}  |  ad alani: ${namespaceMap.size}`);
console.log(`ornek veri: ${sampleKeys.size}/${tools.length} tool'de var (kalan ${withoutSample.length} icin opsiyonel)`);

if (warnings.length) {
  console.log(`\nUYARILAR (${warnings.length}):`);
  for (const warning of warnings) console.log(`  ! ${warning}`);
}

if (errors.length) {
  console.log(`\nHATALAR (${errors.length}):`);
  for (const error of errors) console.log(`  x ${error}`);
  process.exit(1);
}

console.log("\nTum tool ve rehber kayitlari tutarli.");
