"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Unit = { id: string; symbol: string; factor: number };

type Pre =
  | { id: string; label: string; temp: true; units: Unit[] }
  | { id: string; label: string; temp?: false; units: Unit[] };

const PRESETS: Pre[] = [
  {
    id: "speed",
    label: "Speed",
    units: [
      { id: "kph", symbol: "km/h", factor: 1 },
      { id: "mph", symbol: "mph", factor: 1.609344 },
      { id: "knot", symbol: "kn", factor: 1.852 },
      { id: "mps", symbol: "m/s", factor: 3.6 },
      { id: "fts", symbol: "ft/s", factor: 1.09728 },
    ],
  },
  {
    id: "length",
    label: "Length",
    units: [
      { id: "km", symbol: "km", factor: 1000 },
      { id: "m", symbol: "m", factor: 1 },
      { id: "cm", symbol: "cm", factor: 0.01 },
      { id: "mm", symbol: "mm", factor: 0.001 },
      { id: "mi", symbol: "mi", factor: 1609.344 },
      { id: "yd", symbol: "yd", factor: 0.9144 },
      { id: "ft", symbol: "ft", factor: 0.3048 },
      { id: "in", symbol: "in", factor: 0.0254 },
    ],
  },
  {
    id: "temp",
    label: "Temperature",
    temp: true,
    units: [
      { id: "c", symbol: "°C", factor: 1 },
      { id: "f", symbol: "°F", factor: 1 },
      { id: "k", symbol: "K", factor: 1 },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    units: [
      { id: "kg", symbol: "kg", factor: 1 },
      { id: "g", symbol: "g", factor: 0.001 },
      { id: "mg", symbol: "mg", factor: 1e-6 },
      { id: "lb", symbol: "lb", factor: 0.453592 },
      { id: "oz", symbol: "oz", factor: 0.0283495 },
      { id: "st", symbol: "st", factor: 6.35029 },
      { id: "t", symbol: "t", factor: 1000 },
    ],
  },
  {
    id: "data",
    label: "Data storage",
    units: [
      { id: "b", symbol: "B", factor: 1 },
      { id: "kb", symbol: "KB", factor: 1024 },
      { id: "mb", symbol: "MB", factor: 1048576 },
      { id: "gb", symbol: "GB", factor: 1073741824 },
      { id: "tb", symbol: "TB", factor: 1099511627776 },
    ],
  },
];

const FOOD_PANELS: Pre[] = [
  {
    id: "volume",
    label: "Volume",
    units: [
      { id: "cup", symbol: "cup", factor: 0.236588 },
      { id: "ml", symbol: "ml", factor: 0.001 },
      { id: "floz", symbol: "fl oz", factor: 0.0295735 },
      { id: "tbsp", symbol: "tbsp", factor: 0.0147868 },
      { id: "tsp", symbol: "tsp", factor: 0.00492892 },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    units: [
      { id: "g", symbol: "g", factor: 1 },
      { id: "kg", symbol: "kg", factor: 1000 },
      { id: "lb", symbol: "lb", factor: 453.592 },
      { id: "oz", symbol: "oz", factor: 28.3495 },
    ],
  },
];

function toBase(value: number, unit: Unit, pre: Pre): number {
  if (!pre.temp) return value * unit.factor;
  if (unit.id === "c") return value;
  if (unit.id === "f") return (value - 32) * (5 / 9);
  return value - 273.15;
}

function fromBase(value: number, unit: Unit, pre: Pre): number {
  if (!pre.temp) return value / unit.factor;
  if (unit.id === "c") return value;
  if (unit.id === "f") return value * (9 / 5) + 32;
  return value + 273.15;
}

function formatNumber(value: number, locale: string): string {
  if (!Number.isFinite(value) || Number.isNaN(value)) return "—";
  const abs = Math.abs(value);
  return new Intl.NumberFormat(locale, {
    notation: abs >= 100000 || (abs > 0 && abs < 0.001) ? "scientific" : "standard",
    maximumFractionDigits: abs < 1 ? 4 : 2,
  }).format(value);
}

function UnitPanel(props: { pre: Pre; isFoodPanel?: boolean }) {
  const { pre } = props;
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(Math.min(1, pre.units.length - 1));
  const [amountValue, setAmountValue] = useState("1");
  const t = useTranslations("comp.birim");
  const locale = useLocale();

  if (fromIndex >= pre.units.length || toIndex >= pre.units.length) return null;

  const fromUnit = pre.units[fromIndex];
  const toUnit = pre.units[toIndex];
  const parsed = parseFloat(amountValue.replace(",", "."));
  const result = Number.isFinite(parsed)
    ? fromBase(toBase(parsed, fromUnit, pre), toUnit, pre)
    : null;

  function swap() {
    const temp = fromIndex;
    setFromIndex(toIndex);
    setToIndex(temp);
  }

  return (
    <div>
      <p className="text-sm font-medium text-text">
        {t(`pre-${pre.id}-label`)}
      </p>

      <label htmlFor={`birim-sayi-${pre.id}`} className="mt-4 block text-sm font-medium text-muted">
        {t("value")}
      </label>
      <input
        id={`birim-sayi-${pre.id}`}
        type="text"
        inputMode="decimal"
        value={amountValue}
        onChange={(event) => setAmountValue(event.target.value)}
        placeholder="e.g. 120"
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label htmlFor={`birim-from-${pre.id}`} className="block text-sm font-medium text-muted">
            {t("from")}
          </label>
          <select
            id={`birim-from-${pre.id}`}
            value={fromIndex}
            onChange={(event) => setFromIndex(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            {pre.units.map((unit, index) => (
              <option key={unit.id} value={index}>
                {unit.symbol} — {t(`unit-${unit.id}`)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={swap}
          aria-label={t("swap")}
          className="self-end justify-self-center rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-strong hover:text-text sm:mb-0.5"
        >
          ↔
        </button>
        <div>
          <label htmlFor={`birim-to-${pre.id}`} className="block text-sm font-medium text-muted">
            {t("to")}
          </label>
          <select
            id={`birim-to-${pre.id}`}
            value={toIndex}
            onChange={(event) => setToIndex(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            {pre.units.map((unit, index) => (
              <option key={unit.id} value={index}>
                {unit.symbol} — {t(`unit-${unit.id}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-bg px-4 py-3 text-sm text-muted">
        {t("equal")}{" "}
        <span className="font-semibold tabular-nums text-text">
          {formatNumber(parsed, locale)} {fromUnit.symbol}
        </span>
        <span className="mx-1">=</span>
        <span className="font-semibold tabular-nums text-accent">
          {result !== null ? formatNumber(result, locale) : t("invalid")} {toUnit.symbol}
        </span>
      </div>
    </div>
  );
}

export default function BirimDonusturucu() {
  const [tab, setTab] = useState("speed");
  const t = useTranslations("comp.birim");

  const pre = PRESETS.find((preset) => preset.id === tab);

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("tabAria")}
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface-2 p-1"
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            role="tab"
            aria-selected={tab === preset.id}
            onClick={() => setTab(preset.id)}
            className={`flex-1 whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              tab === preset.id ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
            }`}
          >
            {t(`tab-${preset.id}`)}
          </button>
        ))}
        <button
          type="button"
          role="tab"
          aria-selected={tab === "food"}
          onClick={() => setTab("food")}
          className={`flex-1 whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium transition-colors ${
            tab === "food" ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
          }`}
        >
          {t("tab-food")}
        </button>
      </div>

      <div className="mt-6">
        {pre ? (
          <UnitPanel pre={pre} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {FOOD_PANELS.map((panel) => (
              <div
                key={panel.id}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <h3 className="text-base font-semibold text-text">
                  {t(`tab-${panel.id}`)}
                </h3>
                <UnitPanel pre={panel} isFoodPanel />
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}