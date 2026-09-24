"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

type ReverseMode = "chars" | "words" | "wordChars";

const MODES: { key: ReverseMode }[] = [
  { key: "chars" },
  { key: "words" },
  { key: "wordChars" },
];

function reverseString(value: string): string {
  return value.split("").reverse().join("");
}

function reverseWordCharacters(value: string): string {
  return value
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : reverseString(part)))
    .join("");
}

function reverseWords(value: string): string {
  return value.split(/(\s+)/).reverse().join("");
}

export default function TextReverser() {
  const [mode, setMode] = useState<ReverseMode>("chars");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.textReverser");

  const output = useMemo(() => {
    if (mode === "chars") return reverseString(text);
    if (mode === "wordChars") return reverseWordCharacters(text);
    return reverseWords(text);
  }, [mode, text]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="ters-metin"
        className="block text-sm font-medium text-text"
      >
        {t("label")}
      </label>
      <textarea
        id="ters-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["text-reverser"])} />
      </div>

      <label
        htmlFor="ters-mod"
        className="mt-5 block text-sm font-medium text-text"
      >
        {t("modeLabel")}
      </label>
      <select
        id="ters-mod"
        value={mode}
        onChange={(event) => setMode(event.target.value as ReverseMode)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none sm:w-auto"
      >
        {MODES.map((option) => (
          <option key={option.key} value={option.key}>
            {t(
              `option${option.key.charAt(0).toUpperCase()}${option.key.slice(1)}`
            )}
          </option>
        ))}
      </select>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text">{t("outputLabel")}</p>
        <button
          type="button"
          onClick={copy}
          disabled={!output}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <textarea
        value={output}
        readOnly
        rows={8}
        spellCheck={false}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}