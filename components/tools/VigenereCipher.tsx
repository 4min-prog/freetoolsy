"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZQWX";
const INPUT_LIMIT = 5000;

export default function VigenereCipher() {
  const [input, setInput] = useState("");
  const [key, setKey] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.vigenereCipher");

  const output = useMemo(() => {
    const cleanKey = key.toUpperCase().replace(/[^A-ZÇĞİÖŞÜQWX]/g, "");
    if (!cleanKey || !input) return "";
    const text = input.toUpperCase();
    let result = "";
    let keyIndex = 0;
    for (let i = 0; i < Math.min(text.length, INPUT_LIMIT); i++) {
      const char = text[i];
      const charPos = ALPHABET.indexOf(char);
      if (charPos === -1) {
        result += input[i];
        continue;
      }
      const shift = mode === "encrypt" ? 1 : -1;
      const keyPos = ALPHABET.indexOf(cleanKey[keyIndex % cleanKey.length]);
      const newPos = (charPos + shift * keyPos + ALPHABET.length) % ALPHABET.length;
      result += ALPHABET[newPos];
      keyIndex++;
    }
    return result;
  }, [input, key, mode]);

  function copyOutput() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <label htmlFor="vc-input" className="block text-xs font-medium text-muted">
            {t("inputLabel")}
          </label>
          <textarea
            id="vc-input"
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, INPUT_LIMIT))}
            placeholder={t("inputPlaceholder")}
            className="mt-1 min-h-24 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="flex-1 min-w-64">
          <label htmlFor="vc-key" className="block text-xs font-medium text-muted">
            {t("keyLabel")}
          </label>
          <input
            id="vc-key"
            type="text"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder={t("keyPlaceholder")}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-3 flex gap-1 rounded-lg border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setMode("encrypt")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "encrypt"
                  ? "bg-accent text-on-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {t("modeEncrypt")}
            </button>
            <button
              type="button"
              onClick={() => setMode("decrypt")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "decrypt"
                  ? "bg-accent text-on-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {t("modeDecrypt")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="vc-output" className="block text-xs font-medium text-muted">
            {t("outputLabel")}
          </label>
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-40"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
        <textarea
          id="vc-output"
          readOnly
          value={output}
          placeholder={t("outputPlaceholder")}
          className="mt-1 min-h-24 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}