"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const URL_RE = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;
const HASHTAG_RE = /#([a-zA-Z0-9_çğıöşüÇĞİÖŞÜ]+)/g;
const PHONE_RE = /(?:\+?\d{1,3}[\s()-]*)?(?:\(\d{2,4}\)[\s-]*)?\d{3}[\s-]*\d{3,4}[\s-]*\d{2,4}/g;

type ExtractorType = "email" | "phone" | "url" | "hashtag";

export default function TextExtractor() {
  const t = useTranslations("comp.textExtractor");
  const [text, setText] = useState("");
  const [enabled, setEnabled] = useState<Record<ExtractorType, boolean>>({
    email: true,
    phone: true,
    url: true,
    hashtag: true,
  });
  const [copied, setCopied] = useState(false);

  const groups = useMemo(() => {
    const result: Record<ExtractorType, string[]> = {
      email: [],
      phone: [],
      url: [],
      hashtag: [],
    };
    if (!text.trim()) return result;
    const emails: string[] = [];
    const phones: string[] = [];
    const urls: string[] = [];
    const hashtags: string[] = [];

    for (const item of text.match(EMAIL_RE) ?? []) {
      if (emails.indexOf(item) === -1) emails.push(item);
    }
    for (const item of text.match(PHONE_RE) ?? []) {
      if (phones.indexOf(item) === -1) phones.push(item);
    }
    for (const item of text.match(URL_RE) ?? []) {
      if (urls.indexOf(item) === -1) urls.push(item);
    }
    for (const item of text.match(HASHTAG_RE) ?? []) {
      if (hashtags.indexOf(item) === -1) hashtags.push(item);
    }

    result.email = emails;
    result.phone = phones;
    result.url = urls.map((url) =>
      url.startsWith("http") ? url : `https://${url}`
    );
    result.hashtag = hashtags;
    return result;
  }, [text]);

  const types: ExtractorType[] = ["email", "phone", "url", "hashtag"];
  const total = types.reduce(
    (sum, type) => sum + (enabled[type] ? groups[type].length : 0),
    0
  );

  async function copy(items: string[]) {
    try {
      await navigator.clipboard.writeText(items.join("\n"));
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label htmlFor="ext-metin" className="block text-sm font-medium text-text">
        {t("inputLabel")}
      </label>
      <textarea
        id="ext-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t("placeholder")}
        rows={6}
        className={`${inputClass} mt-1.5 resize-y font-mono`}
      />

      <fieldset className="mt-4">
        <legend className="text-xs font-medium uppercase tracking-wide text-faint">
          {t("typesTitle")}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {types.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-strong"
            >
              <input
                type="checkbox"
                checked={enabled[type]}
                onChange={(event) =>
                  setEnabled((prev) => ({ ...prev, [type]: event.target.checked }))
                }
                className="h-4 w-4 accent-[--color-accent]"
              />
              {t(type)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-text">
            {t("resultsTitle")}
            <span className="ml-2 text-xs font-normal text-faint">
              {t("count", { count: total })}
            </span>
          </p>
          <button
            type="button"
            onClick={() => {
              const all = types.flatMap((type) =>
                enabled[type] ? groups[type] : []
              );
              copy(all);
            }}
            disabled={total === 0}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {copied ? t("copied") : t("copyAll")}
          </button>
        </div>

        {total === 0 && text.trim() ? (
          <p className="mt-3 rounded-lg border border-border bg-bg p-4 text-sm text-muted">
            {t("none")}
          </p>
        ) : null}
        {!text.trim() ? (
          <p className="mt-3 rounded-lg border border-border bg-bg p-4 text-sm text-muted">
            {t("none")}
          </p>
        ) : null}

        {types.map((type) =>
          enabled[type] && groups[type].length > 0 ? (
            <div
              key={type}
              className="mt-3 rounded-lg border border-border bg-bg p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-muted">
                  {t(type)}
                  <span className="ml-2 text-faint">{groups[type].length}</span>
                </p>
                <button
                  type="button"
                  onClick={() => copy(groups[type])}
                  className="shrink-0 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
                >
                  {t("copy")}
                </button>
              </div>
              <ul className="mt-2 space-y-1.5">
                {groups[type].map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between gap-3 break-all font-mono text-xs leading-relaxed text-text"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => copy([item])}
                      className="shrink-0 rounded border border-border bg-surface px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-strong hover:text-text"
                    >
                      {t("copy")}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}