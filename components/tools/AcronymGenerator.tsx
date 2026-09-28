"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

function initialOf(word: string): string | null {
  const match = /[A-Za-z\u00C0-\u024F\u0400-\u04FF0-9]/.exec(word);
  return match ? match[0].toUpperCase() : null;
}

export default function AcronymGenerator() {
  const [phrase, setPhrase] = useState("");
  const [dots, setDots] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.acronymGenerator");

  const acronym = useMemo(() => {
    const initials = phrase
      .split(/[\s\-]+/)
      .map(initialOf)
      .filter((value): value is string => value !== null);
    return initials.join(dots ? "." : "");
  }, [phrase, dots]);

  async function copy() {
    await copyToClipboard(acronym);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="acronym-input"
        className="block text-sm font-medium text-text"
      >
        {t("phraseLabel")}
      </label>
      <input
        id="acronym-input"
        type="text"
        value={phrase}
        onChange={(event) => setPhrase(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={dots}
          onChange={(event) => setDots(event.target.checked)}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        {t("dots")}
      </label>

      {phrase.length > 0 ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4">
          <p className="text-lg font-semibold tracking-tight text-text">
            {acronym || "—"}
          </p>
          <button
            type="button"
            onClick={copy}
            disabled={!acronym}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {copied ? t("copied") : t("copy")}
          </button>
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