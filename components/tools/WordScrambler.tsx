"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

type Mode = "edges" | "full";

function shuffle(chars: string[]): string[] {
  const copy = [...chars];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function scrambleWord(word: string, mode: Mode): string {
  if (word.length <= 3) return word;
  const keepEdges = mode === "edges" && /^[A-Za-zğüşıöçĞÜŞİÖÇ]/.test(word[0]);
  if (keepEdges) {
    const middle = word.slice(1, -1).split("");
    return word[0] + shuffle(middle).join("") + word[word.length - 1];
  }
  return shuffle(word.split("")).join("");
}

export default function WordScrambler() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("edges");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.wordScrambler");

  const output = useMemo(
    () =>
      text
        .split(/(\s+)/)
        .map((part) =>
          part.trim().length > 0 ? scrambleWord(part, mode) : part
        )
        .join(""),
    [text, mode]
  );

  async function copy() {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="scramble-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="scramble-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="mt-2 h-32 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("edges")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            mode === "edges"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border bg-surface text-muted hover:border-strong"
          }`}
        >
          {t("modeEdges")}
        </button>
        <button
          type="button"
          onClick={() => setMode("full")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            mode === "full"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border bg-surface text-muted hover:border-strong"
          }`}
        >
          {t("modeFull")}
        </button>
      </div>

      {text.length > 0 ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm leading-relaxed text-text">{output}</p>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {copied ? t("copied") : t("copy")}
            </button>
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