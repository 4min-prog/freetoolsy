"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const TR_DIGITS = [
  "sıfır",
  "bir",
  "iki",
  "üç",
  "dört",
  "beş",
  "altı",
  "yedi",
  "sekiz",
  "dokuz",
];
const TR_TENS = [
  "",
  "on",
  "yirmi",
  "otuz",
  "kırk",
  "elli",
  "altmış",
  "yetmiş",
  "seksen",
  "doksan",
];
const TR_SCALES = [
  { name: "trilyon", value: 1_000_000_000_000 },
  { name: "milyar", value: 1_000_000_000 },
  { name: "milyon", value: 1_000_000 },
  { name: "bin", value: 1_000 },
];

function trUnder100(n: number): string {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  let result = TR_TENS[tens];
  if (ones > 0) result += (result ? " " : "") + TR_DIGITS[ones];
  return result;
}

function trUnder1000(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  let result = "";
  if (hundreds > 0) result += hundreds === 1 ? "yüz" : `${TR_DIGITS[hundreds]} yüz`;
  if (rest > 0) result += (result ? " " : "") + trUnder100(rest);
  return result;
}

function trBlock(n: number): string {
  if (n === 0) return "sıfır";
  let result = "";
  for (const scale of TR_SCALES) {
    const part = Math.floor(n / scale.value);
    if (part > 0) {
      const head =
        scale.name === "bin"
          ? part === 1
            ? "bin"
            : `${trUnder1000(part)} bin`
          : `${part === 1 ? "bir" : trUnder1000(part)} ${scale.name}`;
      result += (result ? " " : "") + head;
      n -= part * scale.value;
    }
  }
  if (n > 0) result += (result ? " " : "") + trUnder1000(n);
  return result;
}

const EN_ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const EN_TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const EN_SCALES = [
  { name: "trillion", value: 1_000_000_000_000 },
  { name: "billion", value: 1_000_000_000 },
  { name: "million", value: 1_000_000 },
  { name: "thousand", value: 1_000 },
];

function enUnder100(n: number): string {
  if (n < 20) return EN_ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) return EN_TENS[tens];
  return `${EN_TENS[tens]}-${EN_ONES[ones]}`;
}

function enUnder1000(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  let result = "";
  if (hundreds > 0) result += `${EN_ONES[hundreds]} hundred`;
  if (rest > 0) result += (result ? " and " : "") + enUnder100(rest);
  return result;
}

function enBlock(n: number): string {
  if (n === 0) return "zero";
  let result = "";
  for (const scale of EN_SCALES) {
    const part = Math.floor(n / scale.value);
    if (part > 0) {
      result += (result ? " " : "") + `${enUnder1000(part)} ${scale.name}`;
      n -= part * scale.value;
    }
  }
  if (n > 0) result += (result ? " " : "") + enUnder1000(n);
  return result;
}

const MAX_VALUE = 999_000_000_000_000;

export default function NumberToWords() {
  const [input, setInput] = useState("");
  const t = useTranslations("comp.numberToWords");

  const parsed = Number(input.trim());
  const valid =
    input.trim() !== "" &&
    Number.isFinite(parsed) &&
    Number.isInteger(parsed) &&
    parsed >= 0 &&
    parsed <= MAX_VALUE;

  const turkish = useMemo(() => (valid ? trBlock(parsed) : ""), [valid, parsed]);
  const english = useMemo(() => (valid ? enBlock(parsed) : ""), [valid, parsed]);

  return (
    <div>
      <label htmlFor="ntw-input" className="block text-sm font-medium text-text">
        {t("number")}
      </label>
      <input
        id="ntw-input"
        type="text"
        inputMode="numeric"
        placeholder="1254"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {valid ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("turkish")}</p>
            <p className="mt-1 text-base font-medium leading-snug text-text">
              {turkish}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("english")}</p>
            <p className="mt-1 text-base font-medium leading-snug text-text">
              {english}
            </p>
          </div>
        </div>
      ) : (
        input.trim() !== "" && (
          <p className="mt-6 text-sm text-muted">{t("invalid")}</p>
        )
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}