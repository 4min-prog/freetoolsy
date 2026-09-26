"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function stripHtml(value: string, removeScripts: boolean): string {
  const parser = new DOMParser();
  const document = parser.parseFromString(value, "text/html");
  if (removeScripts) {
    document.querySelectorAll("script, style, noscript, template").forEach((node) => node.remove());
  }
  const text = document.body.textContent ?? "";
  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function HtmlToTextConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [removeScripts, setRemoveScripts] = useState(true);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.htmlToTextConverter");

  function convert() {
    setCopied(false);
    const cleaned = stripHtml(input, removeScripts);
    setOutput(cleaned);
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="h2t-input" className="block text-sm font-medium text-text">
            {t("inputLabel")}
          </label>
          <textarea
            id="h2t-input"
            rows={9}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("inputPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="h2t-output" className="block text-sm font-medium text-text">
            {t("outputLabel")}
          </label>
          <textarea
            id="h2t-output"
            rows={9}
            readOnly
            value={output}
            placeholder={t("outputPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={removeScripts}
          onChange={(event) => setRemoveScripts(event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        {t("removeScripts")}
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={convert}
          disabled={!input.trim()}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("convert")}
        </button>
        {output ? (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        ) : null}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}