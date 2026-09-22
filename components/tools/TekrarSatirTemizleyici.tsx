"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function TekrarSatirTemizleyici() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [kept, setKept] = useState(0);
  const [total, setTotal] = useState(0);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.tekrarSatir");

  function removeDuplicates() {
    const lines = text
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const line of lines) {
      if (!seen.has(line)) {
        seen.add(line);
        unique.push(line);
      }
    }
    setKept(unique.length);
    setTotal(lines.length);
    setOutput(unique.join("\n"));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="tekrar-satir-input"
        className="block text-sm font-medium text-text"
      >
        {t("label")}
      </label>
      <textarea
        id="tekrar-satir-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <button
        type="button"
        onClick={removeDuplicates}
        disabled={!text.trim()}
        className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {t("remove")}
      </button>

      {output && (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="tekrar-satir-output"
              className="block text-sm font-medium text-text"
            >
              {t("outputLabel")}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums text-muted">
                {t("kept", { kept, total })}
              </span>
              <button
                type="button"
                onClick={copy}
                disabled={!output}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
              >
                {copied ? t("copied") : t("copy")}
              </button>
            </div>
          </div>
          <textarea
            id="tekrar-satir-output"
            value={output}
            readOnly
            rows={8}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      )}
    </div>
  );
}