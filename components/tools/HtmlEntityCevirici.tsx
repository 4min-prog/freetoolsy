"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const NAMED: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "é": "&eacute;",
  "ç": "&ccedil;",
  "ğ": "&#287;",
  "ı": "&#305;",
  "ö": "&ouml;",
  "ş": "&scedil;",
  "ü": "&uuml;",
  "İ": "&#304;",
};

function encodeHtml(value: string): string {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    out += NAMED[ch] ?? ch;
  }
  return out;
}

function decodeHtml(value: string): string {
  if (!value) return "";
  const doc = new DOMParser().parseFromString(value, "text/html");
  return doc.body ? doc.body.textContent || "" : value;
}

export default function HtmlEntityCevirici() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.htmlEntityCevirici");

  const output = useMemo(
    () => (mode === "encode" ? encodeHtml(text) : decodeHtml(text)),
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
          aria-selected={mode === "encode"}
          onClick={() => setMode("encode")}
          className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            mode === "encode"
              ? "bg-surface text-text shadow-card"
              : "text-muted hover:text-text"
          }`}
        >
          {t("modeEncode")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "decode"}
          onClick={() => setMode("decode")}
          className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            mode === "decode"
              ? "bg-surface text-text shadow-card"
              : "text-muted hover:text-text"
          }`}
        >
          {t("modeDecode")}
        </button>
      </div>

      <label
        htmlFor="html-entity-metin"
        className="mt-5 block text-sm font-medium text-text"
      >
        {mode === "encode" ? t("encodeLabel") : t("decodeLabel")}
      </label>
      <textarea
        id="html-entity-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={7}
        spellCheck={false}
        placeholder={mode === "encode" ? t("encodePlaceholder") : t("decodePlaceholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["html-entity-cevirici"])} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text">
          {mode === "encode" ? t("outputEncode") : t("outputDecode")}
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