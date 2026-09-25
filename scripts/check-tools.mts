/**
 * Tum tool kayitlarinin butunlugu denetleyicisi.
 *
 * Yeni tool eklerken en sik yapilan hata su olur: data/tools.ts'e slug eklenir
 * (sitemap'e girer, kategoriye girer) ama bilesen registry'si, ceviri
 * sozlugu veya ToolMeta eklenmez. Sonuc: sayfa 200 doner ama arac calismaz.
 * Build bunu yakalamaz. Bu betik yakalar.
 *
 * Kullanim: npm run check:tools
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { categories, tools } from "../data/tools.ts";
import { DYNAMIC_TOOL_SLUGS } from "../data/dynamicTools.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const META_KEYS = ["name", "desc", "title", "pageDesc", "intro"];
const errors = [];
const warnings = [];
// Ornek veri opsiyoneldir (hicbir tool icin zorunlu degil), bu yuzden her
// biri icin ayri uyari uretmeyip ozet olarak yaziyoruz.
const withoutSample = [];

function read(file) {
  return readFileSync(resolve(root, file), "utf8");
}

function keysFrom(source, pattern) {
  return [...new Set([...source.matchAll(pattern)].map((match) => match[1]))];
}

// next/dynamic icerdigi icin toolComponents.ts dogrudan import edilemez.
const registeredComponents = new Set(
  keysFrom(read("data/toolComponents.ts"), /"([a-z0-9-]+)":\s*dynamic\(/g)
);
const namespaceMap = new Map(
  [...read("data/toolCompNamespaces.ts").matchAll(/"([a-z0-9-]+)":\s*"([A-Za-z0-9_]+)"/g)].map(
    (match) => [match[1], match[2]]
  )
);
const sampleKeys = new Set(keysFrom(read("data/samples.ts"), /"([a-z0-9-]+)":/g));
// Anahtar tirnakli da olabilir (base64: faRightLeft) olmayabilir, deger
// satir sonunda virgulle de bitebilir de biteyebilir. Hepsini kabul ediyoruz.
const iconKeys = new Set(
  keysFrom(read("components/ToolIcon.tsx"), /^\s*"?([a-z0-9-]+)"?:\s*fa[A-Za-z]+/gm)
);

const messages = {};
for (const locale of ["en", "tr"]) {
  messages[locale] = JSON.parse(read(`messages/${locale}.json`));
}

const seen = new Set();
const categoryIds = new Set(categories.map((category) => category.id));

for (const tool of tools) {
  const { slug, name, category, description } = tool;

  if (seen.has(slug)) errors.push(`${slug}: data/tools.ts icinde yinelenen slug`);
  seen.add(slug);

  if (!/^[a-z0-9-]+$/.test(slug)) errors.push(`${slug}: slug formati yanlis (kucuk harf, rakam, tire)`);
  if (!name?.trim()) errors.push(`${slug}: tools.ts name bos`);
  if (!description?.trim()) errors.push(`${slug}: tools.ts description bos`);
  if (!categoryIds.has(category)) errors.push(`${slug}: bilinmeyen kategori "${category}"`);

  // 1) Bilesen kaydi
  const hasComponent =
    registeredComponents.has(slug) || DYNAMIC_TOOL_SLUGS.has(slug);
  if (!hasComponent) {
    errors.push(
      `${slug}: hicbir yerde bilesen kaydi yok (toolComponents.ts veya DYNAMIC_TOOL_SLUGS)`
    );
  }

  // 2) Ceviri sozlugu + ToolMeta
  for (const locale of ["en", "tr"]) {
    const localeMessages = messages[locale];
    const meta = localeMessages.ToolMeta?.[slug];
    if (!meta) {
      errors.push(`${slug}: messages/${locale}.json icinde ToolMeta.${slug} yok`);
      continue;
    }
    for (const key of META_KEYS) {
      if (!meta[key]?.trim()) {
        errors.push(`${slug}: ToolMeta.${slug}.${key} bos veya eksik (${locale})`);
      }
    }
  }

  // 3) Bilesen ceviri ad alani
  const namespace = namespaceMap.get(slug);
  if (namespace) {
    if (!registeredComponents.has(slug)) {
      errors.push(`${slug}: ceviri ad alani var ama bilesen registry'de yok`);
    }
    for (const locale of ["en", "tr"]) {
      const comp = messages[locale].comp?.[namespace];
      if (!comp) {
        errors.push(
          `${slug}: comp.${namespace} sozlugu messages/${locale}.json icinde yok`
        );
      }
    }
  } else if (registeredComponents.has(slug)) {
    errors.push(`${slug}: toolCompNamespaces.ts icinde ceviri ad alani eksik`);
  }

  // 4) Ikon (kritik degil, fallback var)
  if (!iconKeys.has(slug)) warnings.push(`${slug}: ToolIcon tablosunda ikon yok (faToolbox gosterir)`);
  if (!sampleKeys.has(slug)) withoutSample.push(slug);
}

// 5) Ters yon: registry'de ama tools.ts'te olmayan tool'lar
for (const slug of registeredComponents) {
  if (!seen.has(slug)) errors.push(`${slug}: toolComponents.ts'te var ama data/tools.ts'te yok`);
}
for (const slug of DYNAMIC_TOOL_SLUGS) {
  if (!seen.has(slug)) errors.push(`${slug}: DYNAMIC_TOOL_SLUGS'te var ama data/tools.ts'te yok`);
}
for (const slug of namespaceMap.keys()) {
  if (!seen.has(slug)) errors.push(`${slug}: toolCompNamespaces.ts'te var ama data/tools.ts'te yok`);
}
for (const slug of iconKeys) {
  if (!seen.has(slug)) warnings.push(`${slug}: ToolIcon tablosunda ama data/tools.ts'te yok`);
}

// 6) Iki dilin ToolMeta anahtar setleri ayni mi
const enSlugs = Object.keys(messages.en.ToolMeta ?? {});
const trSlugs = Object.keys(messages.tr.ToolMeta ?? {});
for (const slug of enSlugs) {
  if (!trSlugs.includes(slug)) errors.push(`ToolMeta.${slug}: tr.json'da eksik`);
}
for (const slug of trSlugs) {
  if (!enSlugs.includes(slug)) errors.push(`ToolMeta.${slug}: en.json'da eksik`);
}

console.log(`tools.ts: ${tools.length} tool  |  bilesen: ${registeredComponents.size}  |  ssr:false: ${DYNAMIC_TOOL_SLUGS.size}  |  ikon: ${iconKeys.size}`);
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

console.log("\nTum tool kayitlari tutarli.");
