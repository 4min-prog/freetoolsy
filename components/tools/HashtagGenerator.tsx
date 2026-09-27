"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function cleanWord(word: string): string {
  return word
    .replace(/[^A-Za-z0-9\u00C0-\u024F\u0400-\u04FF]+/g, "")
    .toLowerCase();
}

function toHashtag(phrase: string): string | null {
  const words = phrase.split(/\s+/).map(cleanWord).filter(Boolean);
  if (words.length === 0) return null;
  const joined = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return `#${joined}`;
}

export default function HashtagGenerator() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.hashtagGenerator");

  const hashtags = useMemo(
    () =>
      text
        .split("\n")
        .map(toHashtag)
        .filter((tag): tag is string => tag !== null),
    [text]
  );

  async function copy() {
    await navigator.clipboard.writeText(hashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="hashtag-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="hashtag-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t("inputPlaceholder")}
        className="mt-2 h-32 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {hashtags.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-text">{t("outputTitle")}</p>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
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