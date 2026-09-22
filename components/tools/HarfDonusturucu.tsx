"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function HarfDonusturucu() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.harfDonusturucu");
  const locale = useLocale();

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const transforms: { key: string; label: string; apply: (value: string) => string }[] = [
    {
      key: "upper",
      label: t("upper"),
      apply: (value: string) => value.toLocaleUpperCase(locale),
    },
    {
      key: "lower",
      label: t("lower"),
      apply: (value: string) => value.toLocaleLowerCase(locale),
    },
    {
      key: "title",
      label: t("title"),
      apply: (value: string) =>
        value
          .split(/(\s+)/)
          .map((part) =>
            /^\s+$/.test(part) || part === ""
              ? part
              : part.charAt(0).toLocaleUpperCase(locale) +
                part.slice(1).toLocaleLowerCase(locale)
          )
          .join(""),
    },
    {
      key: "invert",
      label: t("invert"),
      apply: (value: string) =>
        Array.from(value)
          .map((char) =>
            char === char.toLocaleLowerCase(locale)
              ? char.toLocaleUpperCase(locale)
              : char.toLocaleLowerCase(locale)
          )
          .join(""),
    },
  ];

  return (
    <div>
      <label
        htmlFor="harf-metin"
        className="block text-sm font-medium text-text"
      >
        {t("label")}
      </label>
      <textarea
        id="harf-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {transforms.map((transform) => (
          <button
            key={transform.key}
            type="button"
            onClick={() => setText(transform.apply(text))}
            disabled={!text}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {transform.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={copy}
        disabled={!text}
        className="mt-4 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
      >
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}