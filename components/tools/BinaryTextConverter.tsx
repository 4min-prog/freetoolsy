"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Mode = "toBinary" | "toText";

export default function BinaryTextConverter() {
  const [mode, setMode] = useState<Mode>("toBinary");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.binaryTextConverter");

  function textToBinary(value: string): string {
    const bytes = new TextEncoder().encode(value);
    return Array.from(bytes)
      .map((byte) => byte.toString(2).padStart(8, "0"))
      .join(" ");
  }

  function binaryToText(value: string): string {
    const groups = value.trim().split(/\s+/).filter(Boolean);
    if (groups.length === 0) return "";
    const bytes: number[] = [];
    for (const group of groups) {
      if (!/^[01]+$/.test(group)) {
        throw new Error(t("invalidChar"));
      }
      const byte = parseInt(group, 2);
      if (byte > 255) {
        throw new Error(t("invalidByte"));
      }
      bytes.push(byte);
    }
    return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
  }

  function convert() {
    setError("");
    setCopied(false);
    try {
      const result =
        mode === "toBinary" ? textToBinary(input) : binaryToText(input);
      setOutput(result);
    } catch (cause) {
      setOutput("");
      setError(cause instanceof Error ? cause.message : t("invalid"));
    }
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  function swap() {
    setInput(output);
    setOutput(input);
    setMode((current) => (current === "toBinary" ? "toText" : "toBinary"));
    setError("");
    setCopied(false);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("toBinary")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "toBinary"
              ? "btn-accent text-on-accent"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
          }`}
        >
          {t("toBinary")}
        </button>
        <button
          type="button"
          onClick={() => setMode("toText")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "toText"
              ? "btn-accent text-on-accent"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
          }`}
        >
          {t("toText")}
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bin-input" className="block text-sm font-medium text-text">
            {mode === "toBinary" ? t("textLabel") : t("binaryLabel")}
          </label>
          <textarea
            id="bin-input"
            rows={7}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode === "toBinary" ? t("textPlaceholder") : t("binaryPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="bin-output" className="block text-sm font-medium text-text">
            {mode === "toBinary" ? t("binaryLabel") : t("textLabel")}
          </label>
          <textarea
            id="bin-output"
            rows={7}
            readOnly
            value={output}
            placeholder={t("outputPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={convert}
          disabled={!input.trim()}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("convert")}
        </button>
        <button
          type="button"
          onClick={swap}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {t("swap")}
        </button>
        {output ? (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}