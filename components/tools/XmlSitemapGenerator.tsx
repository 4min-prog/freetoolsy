"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value || !/^https?:\/\//i.test(value)) return null;
  return value.replace(/\/+$/, "");
}

export default function XmlSitemapGenerator() {
  const [urls, setUrls] = useState("");
  const [lastmod, setLastmod] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.xmlSitemapGenerator");

  const today = new Date().toISOString().slice(0, 10);
  const validUrls = useMemo(
    () =>
      urls
        .split(/\r?\n/)
        .map(normalizeUrl)
        .filter((url): url is string => url !== null),
    [urls]
  );

  function generate() {
    const entries = validUrls
      .map(
        (url) =>
          `  <url>\n    <loc>${escapeXml(url)}</loc>${
            lastmod ? `\n    <lastmod>${today}</lastmod>` : ""
          }\n  </url>`
      )
      .join("\n");
    setOutput(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`
    );
    setCopied(false);
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const textareaClass =
    "mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm font-mono text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div>
      <label htmlFor="sitemap-urls" className="block text-sm font-medium text-text">
        {t("urls")}
      </label>
      <textarea
        id="sitemap-urls"
        value={urls}
        onChange={(event) => setUrls(event.target.value)}
        placeholder="https://www.freetoolsy.com/"
        className={`${textareaClass} h-40`}
      />

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={lastmod}
          onChange={(event) => setLastmod(event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        {t("lastmod")}
      </label>

      <button
        type="button"
        onClick={generate}
        disabled={validUrls.length === 0}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {t("generate")}
      </button>

      {output && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted">{t("output")}</p>
            <button
              type="button"
              onClick={copy}
              className="text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <textarea readOnly value={output} className={`${textareaClass} mt-2 h-52`} />
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}