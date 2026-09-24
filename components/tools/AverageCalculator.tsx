"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

function extractNumbers(input: string): number[] {
  const values: number[] = [];
  const tokens = input.split(/[\s;]+/);
  for (const token of tokens) {
    if (!token) continue;
    for (const match of token.match(/-?\d+(?:[.,]\d+)?/g) ?? []) {
      const parsed = parseNumber(match);
      if (Number.isFinite(parsed)) values.push(parsed);
    }
  }
  return values;
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-3 text-center">
      <div className="text-2xl font-semibold tabular-nums tracking-tight text-text">
        {props.value}
      </div>
      <div className="mt-1 text-xs text-muted">{props.label}</div>
    </div>
  );
}

export default function AverageCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    avg: number;
    sum: number;
    count: number;
    min: number;
    max: number;
  } | null>(null);
  const t = useTranslations("comp.averageCalculator");
  const locale = useLocale();

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }),
    [locale]
  );

  function calculate() {
    const values = extractNumbers(input);
    if (values.length === 0) {
      setResult(null);
      return;
    }
    const sum = values.reduce((acc, value) => acc + value, 0);
    setResult({
      avg: sum / values.length,
      sum,
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    });
  }

  const tiles = useMemo(() => {
    const dash = "-";
    if (!result) {
      return [
        { key: "avg", label: t("avg"), value: dash },
        { key: "sum", label: t("sum"), value: dash },
        { key: "count", label: t("count"), value: dash },
        { key: "min", label: t("min"), value: dash },
        { key: "max", label: t("max"), value: dash },
      ];
    }
    return [
      { key: "avg", label: t("avg"), value: formatter.format(result.avg) },
      { key: "sum", label: t("sum"), value: formatter.format(result.sum) },
      { key: "count", label: t("count"), value: formatter.format(result.count) },
      { key: "min", label: t("min"), value: formatter.format(result.min) },
      { key: "max", label: t("max"), value: formatter.format(result.max) },
    ];
  }, [result, formatter, t]);

  return (
    <div>
      <label htmlFor="ortalama-girdi" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="ortalama-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={6}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput("12, 18, 24, 30")} />
      </div>

      <button
        type="button"
        onClick={calculate}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("calculate")}
      </button>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {tiles.map((tile) => (
          <Stat key={tile.key} label={tile.label} value={tile.value} />
        ))}
      </div>
    </div>
  );
}