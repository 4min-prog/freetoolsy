"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

type SetKey = keyof typeof SETS;

const OPTIONS: { key: SetKey }[] = [
  { key: "upper" },
  { key: "lower" },
  { key: "digits" },
  { key: "symbols" },
];

const MAX_LENGTH = 128;

function cryptoReady(): boolean {
  return (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  );
}

function randomIndex(max: number): number {
  const limit = Math.floor(4294967296 / max) * max;
  const buf = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % max;
  }
}

function generateOne(length: number, active: SetKey[]): string {
  const pool = active.map((key) => SETS[key]).join("");
  if (!pool) return "";

  const chars: string[] = [];
  for (let i = 0; i < active.length && chars.length < length; i++) {
    const set = SETS[active[i]];
    chars.push(set.charAt(randomIndex(set.length)));
  }
  while (chars.length < length) {
    chars.push(pool.charAt(randomIndex(pool.length)));
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    const tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  }
  return chars.slice(0, length).join("");
}

export default function RastgeleStringUretici() {
  const [length, setLength] = useState("16");
  const [enabled, setEnabled] = useState<SetKey[]>(["upper", "lower", "digits"]);
  const [generated, setGenerated] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.rastgeleStringUretici");

  const optionLabels: Record<SetKey, string> = {
    upper: t("optionUpper"),
    lower: t("optionLower"),
    digits: t("optionDigits"),
    symbols: t("optionSymbols"),
  };

  const regenerate = useCallback(() => {
    if (!cryptoReady()) {
      setError(t("cryptoError"));
      return;
    }
    const num = Number(length);
    if (!Number.isInteger(num) || num < 1 || num > MAX_LENGTH) {
      setError(t("invalidLength"));
      return;
    }
    try {
      setGenerated(generateOne(num, enabled));
      setError(null);
    } catch {
      setError(t("cryptoError"));
    }
  }, [length, enabled, t]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  function toggleSet(key: SetKey) {
    setEnabled((current) => {
      if (current.includes(key)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== key);
      }
      return [...current, key];
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <fieldset>
        <legend className="text-sm font-medium text-text">{t("charTypes")}</legend>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <label
              key={option.key}
              htmlFor={"rs-" + option.key}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                enabled.includes(option.key)
                  ? "border-strong bg-surface text-text"
                  : "border-border bg-bg text-muted hover:border-strong"
              }`}
            >
              <input
                id={"rs-" + option.key}
                type="checkbox"
                checked={enabled.includes(option.key)}
                onChange={() => toggleSet(option.key)}
                className="h-4 w-4 rounded border-strong"
              />
              {optionLabels[option.key]}
            </label>
          ))}
        </div>
      </fieldset>

      <label
        htmlFor="rs-uzunluk"
        className="mt-5 flex items-baseline justify-between text-sm font-medium text-text"
      >
        {t("lengthLabel")}
        <span className="text-sm font-semibold tabular-nums text-accent">
          {length}
        </span>
      </label>
      <input
        id="rs-uzunluk"
        type="number"
        min={1}
        max={MAX_LENGTH}
        value={length}
        onChange={(event) => setLength(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-auto"
      />

      <button
        type="button"
        onClick={regenerate}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("generate")}
      </button>

      {generated ? (
        <div className="mt-5 rounded-lg border border-border bg-bg p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 break-all font-mono text-base leading-relaxed text-text sm:text-lg">
              {generated}
            </p>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>
      ) : null}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text"
        >
          {error}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}