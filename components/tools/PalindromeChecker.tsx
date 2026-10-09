"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

function normalize(value: string, ignore: boolean): string {
  const text = value.toLowerCase();
  if (!ignore) return text.trim();
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    const keep =
      (code >= 0x30 && code <= 0x39) ||
      (code >= 0x41 && code <= 0x5a) ||
      (code >= 0x61 && code <= 0x7a) ||
      (code >= 0xc0 && code <= 0x24f) ||
      (code >= 0x370 && code <= 0x4ff) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0x3040 && code <= 0x30ff);
    if (keep) out += ch;
  }
  return out;
}

export default function PalindromeChecker() {
  const [text, setText] = useState("");
  const [ignore, setIgnore] = useState(true);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.palindromeChecker");

  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function clearAll() {
    setText("");
    setCopied(false);
  }

  const normalized = normalize(text, ignore);
  const reversed = useMemo(
    () => normalized.split("").reverse().join(""),
    [normalized]
  );
  const isPalindrome = normalized.length > 0 && normalized === reversed;

  return (
    <div>
      <label
        htmlFor="palindrome-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="palindrome-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="mt-2 h-32 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <p className="mt-1 text-right text-xs text-muted">{t("chars", { count: text.length })}</p>

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={ignore}
          onChange={(event) => setIgnore(event.target.checked)}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        {t("ignore")}
      </label>

      {text.length > 0 ? (
        <div
          className={`mt-4 rounded-lg border p-4 ${
            isPalindrome
              ? "border-emerald-600/30 bg-emerald-600/10"
              : "border-border bg-surface"
          }`}
        >
          <p
            className={`text-base font-semibold ${
              isPalindrome ? "text-emerald-700" : "text-text"
            }`}
          >
            {isPalindrome ? t("isPalindrome") : t("notPalindrome")}
          </p>
          <p className="mt-2 text-sm text-muted">
            {t("reversed")}{" "}
            <span className="font-medium text-text">{reversed}</span>
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      {text.length > 0 ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {copied ? t("copied") : t("copy")}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {t("clear")}
          </button>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}