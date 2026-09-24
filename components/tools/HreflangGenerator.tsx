"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const LANGS = [
  "en",
  "tr",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "ru",
  "nl",
  "pl",
  "ja",
  "zh",
  "ar",
  "ko",
];

const REGIONS = [
  "en-US",
  "en-GB",
  "tr-TR",
  "de-DE",
  "fr-FR",
  "es-ES",
  "it-IT",
  "pt-BR",
  "ru-RU",
];

type Entry = { lang: string; url: string };

export default function HreflangGenerator() {
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<string[]>(["en", "tr"]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const t = useTranslations("comp.hreflangGenerator");

  function toggleLang(lang: string) {
    setSelected((current) =>
      current.includes(lang)
        ? current.filter((item) => item !== lang)
        : [...current, lang]
    );
  }

  function generate() {
    setError("");
    setOutput("");
    const base = url.trim();
    if (!base) {
      setError(t("emptyUrl"));
      return;
    }
    if (!/^https?:\/\//.test(base)) {
      setError(t("invalidUrl"));
      return;
    }
    const entries: Entry[] = selected.map((lang) => ({
      lang,
      url: lang === "en" ? base : `${base.replace(/\/$/, "")}/${lang}`,
    }));

    const linkLines = entries
      .map(({ lang, url }) => `<link rel="alternate" hreflang="${lang}" href="${url}" />`)
      .join("\n  ");

    const urlLines = entries.map(({ url }) => `    <loc>${url}</loc>`).join("\n");

    setOutput(
      [
        "<!-- 1) Add to the <head> of the page -->",
        `<link rel="canonical" href="${base}" />`,
        `  ${linkLines}`,
        "",
        "<!-- 2) Add to sitemap.xml -->",
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        "  <url>",
        urlLines,
        "  </url>",
        "</urlset>",
      ].join("\n")
    );
  }

  return (
    <div>
      <label htmlFor="hf-url" className="block text-sm font-medium text-text">
        {t("urlLabel")}
      </label>
      <input
        id="hf-url"
        type="text"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://example.com/page"
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label className="mt-4 block text-sm font-medium text-text">
        {t("langLabel")}
      </label>
      <div className="mt-2 flex max-h-40 flex-wrap gap-1.5 overflow-auto rounded-lg border border-border bg-bg p-3">
        {LANGS.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => toggleLang(lang)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              selected.includes(lang)
                ? "bg-accent text-on-accent"
                : "bg-surface text-muted hover:text-text"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("generate")}
        </button>
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLang(lang)}
              className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted transition-colors hover:text-text"
            >
              +{lang}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {output ? (
        <pre className="mt-5 max-h-72 overflow-auto rounded-lg border border-border bg-bg p-3 font-mono text-xs leading-relaxed text-text">
          {output}
        </pre>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}