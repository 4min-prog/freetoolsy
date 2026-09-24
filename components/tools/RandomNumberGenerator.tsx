"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("5");
  const [noRepeat, setNoRepeat] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.randomNumberGenerator");

  function generate() {
    setError("");
    setResults([]);
    setOutput("");
    const minValue = parseNumber(min);
    const maxValue = parseNumber(max);
    const amount = parseNumber(count);
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
      setError(t("invalidRange"));
      return;
    }
    if (minValue > maxValue) {
      setError(t("rangeOrder"));
      return;
    }
    if (!Number.isInteger(amount) || amount < 1 || amount > 1000) {
      setError(t("invalidCount"));
      return;
    }
    const ints = Number.isInteger(minValue) && Number.isInteger(maxValue);
    const span = maxValue - minValue;
    if (noRepeat && ints && amount > span + 1) {
      setError(t("noRepeatLimit"));
      return;
    }
    const pool = noRepeat && ints ? new Set<number>() : null;
    const picked: number[] = [];
    while (picked.length < amount) {
      const value = ints
        ? Math.floor(Math.random() * (span + 1)) + minValue
        : Math.random() * span + minValue;
      if (pool) {
        if (pool.has(value)) continue;
        pool.add(value);
      }
      picked.push(value);
    }
    setResults(picked);
    setOutput(
      picked
        .map((value) =>
          ints ? String(value) : value.toFixed(4)
        )
        .join(", ")
    );
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

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="rng-min" className="block text-sm font-medium text-text">
            {t("minLabel")}
          </label>
          <input
            id="rng-min"
            type="text"
            inputMode="decimal"
            value={min}
            onChange={(event) => setMin(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="rng-max" className="block text-sm font-medium text-text">
            {t("maxLabel")}
          </label>
          <input
            id="rng-max"
            type="text"
            inputMode="decimal"
            value={max}
            onChange={(event) => setMax(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="rng-count" className="block text-sm font-medium text-text">
            {t("countLabel")}
          </label>
          <input
            id="rng-count"
            type="text"
            inputMode="numeric"
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={noRepeat}
          onChange={(event) => setNoRepeat(event.target.checked)}
          className="accent-accent"
        />
        {t("noRepeatLabel")}
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("generate")}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {results.length > 0 ? (
        <div className="mt-5">
          <div className="flex flex-wrap gap-2">
            {results.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm font-semibold tabular-nums text-accent"
              >
                {value}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
