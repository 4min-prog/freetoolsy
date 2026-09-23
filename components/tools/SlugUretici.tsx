"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const EXTRA_MAP: Record<string, string> = {
  "ı": "i",
  "ß": "ss",
  "æ": "ae",
  "œ": "oe",
  "ø": "o",
  "đ": "d",
  "ð": "d",
  "ł": "l",
  "þ": "th",
};

function toAscii(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return base.replace(/[ıßæœøđðłþ]/g, (char) => EXTRA_MAP[char] ?? char);
}

function buildSlug(value: string, separator: string, keepAscii: boolean): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const base = keepAscii
    ? toAscii(trimmed)
    : trimmed.normalize("NFC").toLowerCase();
  const parts = keepAscii
    ? base.split(/[^a-z0-9]+/)
    : base.split(/[^a-z0-9\u00c0-\u024f]+/);
  return parts.filter((part) => part.length > 0).join(separator);
}

export default function SlugUretici() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("-");
  const [keepAscii, setKeepAscii] = useState(true);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.slugUretici");

  const slug = useMemo(
    () => buildSlug(text, separator, keepAscii),
    [text, separator, keepAscii]
  );

  function handleCopy() {
    if (!slug) return;
    navigator.clipboard
      .writeText(slug)
      .then(() => {
        setCopied(true); showToast();
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <label htmlFor="slug-metin" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <input
        id="slug-metin"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t("placeholder")}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["slug-uretici"])} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="slug-ayrac" className="block text-sm font-medium text-text">
            {t("separator")}
          </label>
          <select
            id="slug-ayrac"
            value={separator}
            onChange={(event) => setSeparator(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-auto"
          >
            <option value="-">{t("sepHyphen")}</option>
            <option value="_">{t("sepUnderscore")}</option>
            <option value="">{t("sepNone")}</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-muted transition-colors hover:border-strong">
            <input
              type="checkbox"
              checked={keepAscii}
              onChange={(event) => setKeepAscii(event.target.checked)}
              className="h-4 w-4 rounded accent-accent"
            />
            {t("keepAscii")}
          </label>
        </div>
      </div>

      <p className="mt-5 text-xs font-medium text-muted">{t("outputLabel")}</p>
      <div className="mt-2 rounded-lg border border-border bg-bg p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 break-all font-mono text-sm leading-relaxed text-text">
            {slug || t("empty")}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!slug}
            className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
