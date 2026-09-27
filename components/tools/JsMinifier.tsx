"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function lightMinify(source: string): string {
  const lines = source.split(/\r?\n/);
  return lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("//"))
    .join("\n");
}

export default function JsMinifier() {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.jsMinifier");

  const output = useMemo(() => lightMinify(code), [code]);
  const saved = code.length > 0 ? code.length - output.length : 0;

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="js-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="js-input"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
        className="mt-2 h-44 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {code.length > 0 ? (
        <div className="mt-5 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {t("outputLabel")} · {output.length} {t("bytes")}
              {saved > 0 ? ` (−${saved})` : ""}
            </p>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              className="shrink-0 rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre rounded-lg border border-border bg-bg p-3 font-mono text-xs text-text">
            {output}
          </pre>
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