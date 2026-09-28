"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

function inRange(code: number, min: number, max: number): boolean {
  return code >= min && code <= max;
}

function isEmoji(code: number, next: number | null): boolean {
  if (inRange(code, 0x1f300, 0x1faff)) return true;
  if (inRange(code, 0x2600, 0x27bf)) return true;
  if (inRange(code, 0x1f1e6, 0x1f1ff)) return true;
  if (inRange(code, 0x2700, 0x27bf)) return true;
  if (code === 0xfe0f || code === 0x200d) return true;
  if (inRange(code, 0x2190, 0x21ff)) return true;
  if (inRange(code, 0x2b00, 0x2bff)) return true;
  if (inRange(code, 0x2300, 0x23ff)) return next === 0xfe0f;
  return false;
}

function removeEmoji(text: string): string {
  let out = "";
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const code = chars[i].codePointAt(0) ?? 0;
    const next = chars[i + 1] ? chars[i + 1].codePointAt(0) ?? null : null;
    if (isEmoji(code, next)) {
      continue;
    }
    out += chars[i];
  }
  return out.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").trim();
}

export default function EmojiRemover() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.emojiRemover");

  const output = useMemo(() => removeEmoji(text), [text]);
  const removed = output !== null ? text.length - output.length : 0;

  async function copy() {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="emoji-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="emoji-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="mt-2 h-32 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {text.length > 0 ? (
        <div className="mt-5 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-text">{t("outputLabel")}</p>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <p className="mt-3 whitespace-pre-wrap rounded-lg border border-border bg-bg p-3 text-sm text-text">
            {output || "—"}
          </p>
          <p className="mt-3 text-xs text-muted">
            {t("removed", { count: removed })}
          </p>
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