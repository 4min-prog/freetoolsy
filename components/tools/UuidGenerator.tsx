"use client";

import { showToast } from "@/lib/toast";

import { useState } from "react";
import { useTranslations } from "next-intl";

const COUNT_OPTIONS = [1, 5, 10, 25, 50];

function randomHex(length: number): string {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  let out = "";
  for (let i = 0; i < values.length; i++) {
    out += values[i].toString(16).padStart(2, "0");
  }
  return out;
}

function generateV4(): string {
  const hex = randomHex(16);
  return (
    hex.slice(0, 8) +
    "-" +
    hex.slice(8, 12) +
    "-4" +
    hex.slice(13, 16) +
    "-" +
    "89ab".charAt(parseInt(hex[16], 16) & 3) +
    hex.slice(17, 20) +
    "-" +
    hex.slice(20, 32)
  );
}

function generateV4Count(count: number): string[] {
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    list.push(generateV4());
  }
  return list;
}

function formatV4(value: string): string {
  return value.toUpperCase();
}

function isUuid(value: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value.trim());
}

function isValidInput(value: string): boolean {
  return value.trim().split(/[\s,]+/).every((part) => isUuid(part));
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState<"generate" | "format">("generate");
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState<string[]>(() => generateV4Count(5));
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.uuidGenerator");

  function regenerate() {
    setGenerated(generateV4Count(count));
    setError(null);
  }

  function handleFormat() {
    setError(null);
    if (!input.trim()) {
      setError(t("emptyError"));
      setGenerated([]);
      return;
    }
    if (!isValidInput(input)) {
      setError(t("invalidError"));
      setGenerated([]);
      return;
    }
    const list = input
      .trim()
      .split(/[\s,]+/)
      .map((value) => formatV4(value));
    setGenerated(list);
  }

  function handleCopyAll() {
    navigator.clipboard
      .writeText(generated.join("\n"))
      .then(() => {
        setCopied(true); showToast();
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={t("tabAria")}
          className="flex gap-1 rounded-lg border border-border bg-surface-2 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "generate"}
            onClick={() => setMode("generate")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "generate" ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
            }`}
          >
            {t("tabGenerate")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "format"}
            onClick={() => setMode("format")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "format" ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
            }`}
          >
            {t("tabFormat")}
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          disabled={generated.length === 0}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copyAll")}
        </button>
      </div>

      {mode === "generate" ? (
        <div className="mt-5">
          <label htmlFor="uuid-adet" className="block text-sm font-medium text-text">
            {t("count")}
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {COUNT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCount(option)}
                aria-pressed={count === option}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  count === option
                    ? "bg-accent text-on-accent"
                    : "border border-border bg-surface text-muted hover:border-strong hover:text-text"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={regenerate}
            className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("generate")}
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <label htmlFor="uuid-input" className="block text-sm font-medium text-text">
            {t("inputLabel")}
          </label>
          <textarea
            id="uuid-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={5}
            spellCheck={false}
            placeholder={t("inputPlaceholder")}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={handleFormat}
            className="mt-3 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("format")}
          </button>
        </div>
      )}

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      ) : generated.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-border">
          {generated.map((uuid, index) => (
            <div
              key={uuid + index}
              className="flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-2.5 first:border-t-0"
            >
              <code className="min-w-0 break-all font-mono text-xs text-text sm:text-sm">
                {uuid}
              </code>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard
                    .writeText(uuid)
                    .then(() => undefined)
                    .catch(() => undefined)
                }
                className="shrink-0 rounded-md border border-border bg-bg px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-strong hover:text-text"
              >
                {t("copy")}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">
        {mode === "generate" ? t("note") : t("formatNote")}
      </p>
    </div>
  );
}