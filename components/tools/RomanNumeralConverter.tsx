"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const ROMAN_SYMBOLS: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

function toRoman(value: number): string {
  if (!Number.isInteger(value) || value < 1 || value > 3999) return "";
  let remaining = value;
  let result = "";
  for (const [numeral, symbol] of ROMAN_SYMBOLS) {
    while (remaining >= numeral) {
      result += symbol;
      remaining -= numeral;
    }
  }
  return result;
}

function fromRoman(input: string): number {
  const letters = input.toUpperCase().trim();
  if (!letters) return 0;
  let total = 0;
  let previous = 0;
  for (let i = letters.length - 1; i >= 0; i--) {
    const current = ROMAN_VALUES[letters[i]];
    if (current === undefined) return NaN;
    if (current < previous) total -= current;
    else {
      total += current;
      previous = current;
    }
  }
  return total;
}

export default function RomanNumeralConverter() {
  const [decimal, setDecimal] = useState("");
  const [roman, setRoman] = useState("");
  const [error, setError] = useState("");
  const t = useTranslations("comp.romanNumeralConverter");

  function updateFromDecimal(value: string) {
    if (value === "") {
      setDecimal("");
      setRoman("");
      setError("");
      return;
    }
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 1 || numeric > 3999) {
      setDecimal(value);
      setRoman("");
      setError(t("rangeHint"));
      return;
    }
    setDecimal(String(numeric));
    setRoman(toRoman(numeric));
    setError("");
  }

  function updateFromRoman(value: string) {
    if (value === "") {
      setRoman("");
      setDecimal("");
      setError("");
      return;
    }
    const numeric = fromRoman(value);
    if (Number.isNaN(numeric) || numeric < 1 || numeric > 3999) {
      setRoman(value);
      setDecimal("");
      setError(t("invalidRoman"));
      return;
    }
    setRoman(value.toUpperCase());
    setDecimal(String(numeric));
    setError("");
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="roman-decimal" className="block text-sm font-medium text-text">
            {t("decimalLabel")}
          </label>
          <input
            id="roman-decimal"
            type="text"
            inputMode="numeric"
            value={decimal}
            onChange={(event) => updateFromDecimal(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="roman-roman" className="block text-sm font-medium text-text">
            {t("romanLabel")}
          </label>
          <input
            id="roman-roman"
            type="text"
            value={roman}
            onChange={(event) => updateFromRoman(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {decimal && roman ? (
        <p className="mt-3 text-sm text-muted">
          {decimal} = <span className="font-semibold text-accent">{roman}</span>
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}