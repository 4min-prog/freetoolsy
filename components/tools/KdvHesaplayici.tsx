"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const RATES = [1, 8, 10, 18, 20];

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

export default function KdvHesaplayici() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState<number>(20);
  const [mode, setMode] = useState<"haric" | "dahil">("haric");
  const t = useTranslations("comp.kdv");
  const locale = useLocale();

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [locale]
  );

  const result = useMemo(() => {
    const value = parseNumber(amount);
    if (!Number.isFinite(value) || value < 0) return null;
    const percent = rate / 100;
    if (mode === "haric") {
      const vat = value * percent;
      return {
        base: value,
        vat,
        total: value + vat,
      };
    }
    const base = value / (1 + percent);
    return {
      base,
      vat: value - base,
      total: value,
    };
  }, [amount, rate, mode]);

  const rows = result
    ? [
        { key: "base", value: result.base, strong: false },
        { key: "vat", value: result.vat, strong: true },
        { key: "total", value: result.total, strong: false },
      ]
    : [];

  return (
    <div>
      <label htmlFor="kdv-tutar" className="block text-sm font-medium text-text">
        {t("amount")}
      </label>
      <input
        id="kdv-tutar"
        type="text"
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder={t("amountPlaceholder")}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => { setAmount("250"); setRate(20); }} />
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-text">{t("rate")}</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {RATES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRate(option)}
              aria-pressed={rate === option}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                rate === option
                  ? "bg-accent text-on-accent"
                  : "border border-border bg-surface text-muted hover:border-strong hover:text-text"
              }`}
            >
              %{option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-text">
          {t("amountType")}
        </legend>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {[
            { value: "haric" as const, label: t("exclusive") },
            { value: "dahil" as const, label: t("inclusive") },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-muted transition-colors hover:border-strong"
            >
              <input
                type="radio"
                name="kdv-mode"
                checked={mode === option.value}
                onChange={() => setMode(option.value)}
                className="h-4 w-4 accent-accent"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("liveNote")}</p>

      {result ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
                index === 1 ? "bg-accent/10" : "bg-surface"
              } border-t border-border first:border-t-0`}
            >
              <span className="text-muted">{t(row.key)}</span>
              <span
                className={`tabular-nums ${
                  row.strong ? "text-lg font-semibold text-text" : "text-text"
                }`}
              >
                {formatter.format(row.value)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}
    </div>
  );
}