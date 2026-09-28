"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const MAX_RENDERED_URLS = 500;

export default function SitemapUrlExtractor() {
  const [xml, setXml] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.sitemapUrlExtractor");

  const urls = useMemo(() => {
    const stripped = xml.replace(/<!--[\s\S]*?-->/g, "");
    const regex = /<loc[^>]*>([\s\S]*?)<\/loc>/gi;
    const result: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(stripped)) !== null) {
      const value = match[1].trim();
      if (value) result.push(value);
    }
    return result;
  }, [xml]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  const visibleUrls = urls.slice(0, MAX_RENDERED_URLS);

  return (
    <div>
      <label
        htmlFor="sitemap-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="sitemap-input"
        value={xml}
        onChange={(event) => setXml(event.target.value)}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 h-40 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-xs text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {xml.length > 0 ? (
        <div className="mt-5 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {t("count", { count: urls.length })}
            </p>
            <button
              type="button"
              onClick={copy}
              disabled={urls.length === 0}
              className="shrink-0 rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          {urls.length > 0 ? (
            <ul className="mt-3 max-h-64 overflow-auto rounded-lg border border-border bg-bg p-3 font-mono text-xs text-text">
              {visibleUrls.map((url, index) => (
                <li key={`${url}-${index}`} className="py-0.5">
                  {url}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">{t("noLoc")}</p>
          )}
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}