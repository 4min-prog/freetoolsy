"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const MORSE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "&": ".-...",
  "(": "-.--.",
  ")": "-.--.-",
  "-": "-....-",
};

const FROM_MORSE: Record<string, string> = {};
for (const entry of Object.entries(MORSE)) {
  FROM_MORSE[entry[1]] = entry[0];
}

function toMorse(value: string): string {
  const words = value.toLocaleUpperCase().split(/\s+/);
  const parts: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!word) continue;
    const codes: string[] = [];
    for (let j = 0; j < word.length; j++) {
      codes.push(MORSE[word[j]] ?? word[j]);
    }
    parts.push(codes.join(" "));
  }
  return parts.join(" / ");
}

function fromMorse(value: string): string {
  const tokens = value.trim().split(/\s+/);
  let out = "";
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;
    if (token === "/") {
      out += " ";
    } else {
      out += FROM_MORSE[token] ?? token;
    }
  }
  return out;
}

export default function MorseCevirici() {
  const [mode, setMode] = useState<"text" | "morse">("text");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.morseCevirici");

  const output = useMemo(
    () => (mode === "text" ? toMorse(text) : fromMorse(text)),
    [mode, text]
  );

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
      <div
        role="tablist"
        aria-label={t("tabAria")}
        className="inline-flex gap-1 rounded-lg border border-border bg-surface-2 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "text"}
          onClick={() => setMode("text")}
          className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            mode === "text"
              ? "bg-surface text-text shadow-card"
              : "text-muted hover:text-text"
          }`}
        >
          {t("modeText")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "morse"}
          onClick={() => setMode("morse")}
          className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            mode === "morse"
              ? "bg-surface text-text shadow-card"
              : "text-muted hover:text-text"
          }`}
        >
          {t("modeMorse")}
        </button>
      </div>

      <label
        htmlFor="morse-metin"
        className="mt-5 block text-sm font-medium text-text"
      >
        {mode === "text" ? t("textLabel") : t("morseLabel")}
      </label>
      <textarea
        id="morse-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={7}
        spellCheck={false}
        placeholder={mode === "text" ? t("textPlaceholder") : t("morsePlaceholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["morse-cevirici"])} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text">
          {mode === "text" ? t("outputText") : t("outputMorse")}
        </p>
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
        rows={7}
        spellCheck={false}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}