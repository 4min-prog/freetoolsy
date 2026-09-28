"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

export default function TextEscapeUnescape() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.textEscapeUnescape");

  function escape() {
    setError(null);
    try {
      setOutput(JSON.stringify(input).slice(1, -1));
    } catch {
      setError(t("invalid"));
    }
  }

  function unescape() {
    setError(null);
    try {
      setOutput(JSON.parse(`"${input}"`) as string);
    } catch {
      setError(t("invalid"));
    }
  }

  async function copy() {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="escape-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="escape-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-2 h-32 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={escape}
          disabled={!input}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("escape")}
        </button>
        <button
          type="button"
          onClick={unescape}
          disabled={!input}
          className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("unescape")}
        </button>
      </div>

      {error ? (
        <p className="mt-6 rounded-lg border border-red-600/30 bg-red-600/10 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : output ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-text">{t("outputLabel")}</p>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap break-all rounded-lg border border-border bg-bg p-3 font-mono text-sm text-text">
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