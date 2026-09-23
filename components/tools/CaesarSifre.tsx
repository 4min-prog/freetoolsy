"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

function caesar(value: string, shift: number, decrypt: boolean): string {
  const amount = decrypt ? (26 - shift) % 26 : shift % 26;
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      out += String.fromCharCode(65 + ((code - 65 + amount) % 26));
    } else if (code >= 97 && code <= 122) {
      out += String.fromCharCode(97 + ((code - 97 + amount) % 26));
    } else {
      out += value[i];
    }
  }
  return out;
}

export default function CaesarSifre() {
  const [text, setText] = useState("");
  const [shift, setShift] = useState(3);
  const [decrypt, setDecrypt] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.caesarSifre");

  const output = useMemo(
    () => caesar(text, shift, decrypt),
    [text, shift, decrypt]
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={t("directionAria")}
          className="flex gap-1 rounded-lg border border-border bg-surface-2 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!decrypt}
            onClick={() => setDecrypt(false)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              !decrypt ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
            }`}
          >
            {t("modeEncrypt")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={decrypt}
            onClick={() => setDecrypt(true)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              decrypt ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
            }`}
          >
            {t("modeDecrypt")}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShift(13)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {t("rot13")}
        </button>
      </div>

      <label
        htmlFor="caesar-metin"
        className="mt-5 block text-sm font-medium text-text"
      >
        {t("label")}
      </label>
      <textarea
        id="caesar-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["caesar-sifre"])} />
      </div>

      <label
        htmlFor="caesar-kaydirma"
        className="mt-5 flex items-baseline justify-between text-sm font-medium text-text"
      >
        {t("shift")}
        <span className="text-sm font-semibold tabular-nums text-accent">{shift}</span>
      </label>
      <input
        id="caesar-kaydirma"
        type="range"
        min={1}
        max={25}
        value={shift}
        onChange={(event) => setShift(Number(event.target.value))}
        className="mt-3 w-full accent-accent"
      />

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
        rows={6}
        spellCheck={false}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}