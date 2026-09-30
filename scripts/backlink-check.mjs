const QUERY = '"freetoolsy.com" -site:freetoolsy.com';
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function decode(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

async function duckduckgo() {
  const res = await fetch(
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(QUERY)}`,
    { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) }
  );
  if (!res.ok) throw new Error(`duckduckgo ${res.status}`);
  const html = await res.text();
  const results = [];
  const re = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    let href = decode(m[1]);
    const wrapped = href.match(/uddg=([^&]+)/);
    if (wrapped) href = decodeURIComponent(wrapped[1]);
    if (href.includes("freetoolsy.com")) continue;
    results.push({ title: stripTags(m[2]), url: href });
  }
  return results;
}

async function bing() {
  const res = await fetch(
    `https://www.bing.com/search?q=${encodeURIComponent(QUERY)}&count=50`,
    { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) }
  );
  if (!res.ok) throw new Error(`bing ${res.status}`);
  const html = await res.text();
  const results = [];
  const re = /<h2><a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a><\/h2>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = decode(m[1]);
    if (href.includes("freetoolsy.com")) continue;
    results.push({ title: stripTags(m[2]), url: href });
  }
  return results;
}

function summarize(results) {
  const domains = new Map();
  for (const r of results) {
    let host;
    try {
      host = new URL(r.url).hostname.replace(/^www\./, "");
    } catch {
      continue;
    }
    const current = domains.get(host) || { host, links: 0, titles: [] };
    current.links += 1;
    if (current.titles.length < 2) current.titles.push(r.title.slice(0, 70));
    domains.set(host, current);
  }
  return [...domains.values()].sort((a, b) => b.links - a.links);
}

const sources = [
  { name: "DuckDuckGo", run: duckduckgo },
  { name: "Bing", run: bing },
];

const all = [];
const failures = [];

for (const source of sources) {
  try {
    const found = await source.run();
    all.push(...found);
    console.log(`${source.name}: ${found.length} sonuc`);
  } catch (error) {
    failures.push(`${source.name}: ${error.message}`);
    console.error(`${source.name}: HATA - ${error.message}`);
  }
}

const seen = new Set();
const unique = all.filter((r) => {
  const key = r.url.replace(/\/$/, "");
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const byDomain = summarize(unique);

console.log("");
if (byDomain.length === 0) {
  console.log("Henuz backlink bulunamadi.");
} else {
  console.log(`${byDomain.length} farkli site, ${unique.length} link:`);
  console.log("");
  for (const d of byDomain) {
    console.log(`  ${String(d.links).padStart(2)}x  ${d.host}`);
    for (const t of d.titles) console.log(`       - ${t}`);
  }
}

console.log("");
console.log(`Toplam: ${unique.length} link / ${byDomain.length} alan adi`);

const out = {
  checkedAt: new Date().toISOString(),
  query: QUERY,
  totalLinks: unique.length,
  totalDomains: byDomain.length,
  domains: byDomain,
  failures,
};
console.log("");
console.log(JSON.stringify(out, null, 2));
