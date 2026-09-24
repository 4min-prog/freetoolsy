"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const SGK_EMPLOYEE = 0.14;
const UNEMPLOYMENT = 0.01;
const STAMP_TAX = 0.00759;
const KID_ALLOWANCE = 0;

type Bracket = { min: number; max: number; rate: number };

const BRACKETS_2026: Bracket[] = [
  { min: 0, max: 158000, rate: 0.15 },
  { min: 158000, max: 330000, rate: 0.20 },
  { min: 330000, max: 1200000, rate: 0.27 },
  { min: 1200000, max: 4300000, rate: 0.35 },
  { min: 4300000, max: Number.MAX_SAFE_INTEGER, rate: 0.40 },
];

function computeTax(grossYearly: number): number {
  let tax = 0;
  let taxed = 0;
  for (const bracket of BRACKETS_2026) {
    const top = Math.min(grossYearly, bracket.max);
    if (top <= taxed) break;
    tax += (top - taxed) * bracket.rate;
    taxed = top;
  }
  return tax;
}

function cleanNumber(value: string): number {
  const n = value.trim().replace(",", ".");
  return Number(n);
}

export default function SalaryCalculator() {
  const [gross, setGross] = useState("");
  const t = useTranslations("comp.salaryCalculator");
  const locale = useLocale();

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }),
    [locale]
  );

  const result = useMemo<{
    grossMonthly: number;
    sggk: number;
    unemployment: number;
    tax: number;
    stamp: number;
    netMonthly: number;
    netYearly: number;
  } | null>(() => {
    const grossMonthly = cleanNumber(gross);
    if (!Number.isFinite(grossMonthly) || grossMonthly <= 0) return null;

    const sggk = grossMonthly * SGK_EMPLOYEE;
    const unemployment = grossMonthly * UNEMPLOYMENT;
    const taxableMonthly = grossMonthly - sggk - unemployment - KID_ALLOWANCE;
    const tax = computeTax(Math.max(taxableMonthly * 12, 0)) / 12;
    const stamp = grossMonthly * STAMP_TAX;
    const netMonthly = grossMonthly - sggk - unemployment - tax - stamp;
    return {
      grossMonthly,
      sggk,
      unemployment,
      tax,
      stamp,
      netMonthly,
      netYearly: netMonthly * 12,
    };
  }, [gross]);

  const tiles = [
    { key: "netMonthly", label: t("netMonthly"), value: result ? currency.format(result.netMonthly) : "-" },
    { key: "monthlyTax", label: t("monthlyTax"), value: result ? currency.format(result.tax) : "-" },
    { key: "sggkShare", label: t("sggkShare"), value: result ? currency.format(result.sggk) : "-" },
    { key: "netYearly", label: t("netYearly"), value: result ? currency.format(result.netYearly) : "-" },
  ];

  return (
    <div>
      <div>
        <label htmlFor="sal-gross" className="block text-sm font-medium text-text">
          {t("grossLabel")}
        </label>
        <input
          id="sal-gross"
          type="text"
          inputMode="decimal"
          value={gross}
          onChange={(event) => setGross(event.target.value)}
          placeholder={t("grossPlaceholder")}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <SampleButton onApply={() => setGross("50000")} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>

      {result ? (
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <div key={tile.key} className="rounded-lg border border-border bg-bg px-3 py-3 text-center">
              <div className="text-xl font-semibold tabular-nums tracking-tight text-text">
                {tile.value}
              </div>
              <div className="mt-1 text-xs text-muted">{tile.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}
    </div>
  );
}
