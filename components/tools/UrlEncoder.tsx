"use client";

import { showToast } from "@/lib/toast";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

function encodeUrl(text: string): string {
  return encodeURIComponent(text);
}

function decodeUrl(text: string): string {
  return decodeURIComponent(text.replace(/\+/g, " "));
}

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.urlEncoder");

  function encode() {
    setError(null);
    setOutput(encodeUrl(input));
  }

  function decode() {
    const trimmed = input.trim();
    if (!trimmed) {
      setError(t("emptyError"));
      setOutput("");
      return;
    }
    try {
      setError(null);
      setOutput(decodeUrl(trimmed));
    } catch {
      setError(t("invalidError"));
      setOutput("");
    }
  }

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
        htmlFor="url-girdi"
        className="block text-sm font-medium text-text"
      >
        {t("input")}
      </label>
      <textarea
        id="url-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={5}
        spellCheck={false}
        placeholder={t("placeholderInput")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["url-encoder"])} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={encode}
          disabled={!input}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("encode")}
        </button>
        <button
          type="button"
          onClick={decode}
          disabled={!input}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {t("decode")}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="url-cikti"
            className="text-sm font-medium text-text"
          >
            {t("output")}
          </label>
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
          id="url-cikti"
          readOnly
          value={output}
          rows={5}
          spellCheck={false}
          placeholder={t("placeholderOutput")}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <p className="mt-5 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-xs text-muted">
        {t("linklyNote")}{" "}
        <a
          href="https://linklyhub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent transition-opacity hover:opacity-80"
        >
          linklyhub.com
        </a>
      </p>
    </div>
  );
}