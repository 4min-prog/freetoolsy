"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const BRACKETS: { threshold: number; rate: number }[] = [
  { threshold: 0, rate: 0.1 },
  { threshold: 11925, rate: 0.12 },
  { threshold: 48475, rate: 0.22 },
  { threshold: 103350, rate: 0.24 },
  { threshold: 197300, rate: 0.32 },
  { threshold: 250525, rate: 0.35 },
  { threshold: 626350, rate: 0.37 },
];

const STANDARD_DEDUCTION = 14600;

function money(value: number): string {
  return "$" + value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("75000");
  const [applyDeduction, setApplyDeduction] = useState(true);
  const t = useTranslations("comp.incomeTaxCalculator");

  const result = useMemo(() => {
    const gross = Number(income.replace(",", ""));
    if (!Number.isFinite(gross) || gross < 0) return null;
    const taxable = Math.max(gross - (applyDeduction ? STANDARD_DEDUCTION : 0), 0);
    let tax = 0;
    let marginalRate = BRACKETS[0].rate;
    for (let i = BRACKETS.length - 1; i >= 0; i--) {
      if (taxable >= BRACKETS[i].threshold) {
        marginalRate = BRACKETS[i].rate;
        break;
      }
    }
    for (let i = 0; i < BRACKETS.length - 1; i++) {
      const top = BRACKETS[i + 1].threshold;
      if (taxable > BRACKETS[i].threshold) {
        tax += (Math.min(taxable, top) - BRACKETS[i].threshold) * BRACKETS[i].rate;
      }
    }
    const last = BRACKETS[BRACKETS.length - 1].threshold;
    if (taxable > last) tax += (taxable - last) * BRACKETS[BRACKETS.length - 1].rate;
    const effective = taxable > 0 ? tax / taxable : 0;
    return { gross, taxable, tax, effective, marginalRate };
  }, [income, applyDeduction]);

  return (
    <div>
      <div className="max-w-md">
        <label htmlFor="tax-income" className="block text-xs font-medium text-muted">
          {t("incomeLabel")}
        </label>
        <input
          id="tax-income"
          type="text"
          inputMode="numeric"
          value={income}
          onChange={(event) => setIncome(event.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <label className="mt-4 flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={applyDeduction}
            onChange={(event) => setApplyDeduction(event.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          {t("standardDeduction")}
        </label>
      </div>

      {result ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{t("taxableIncome")}</p>
              <p className="mt-1 text-lg font-semibold text-text">{money(result.taxable)}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{t("federalTax")}</p>
              <p className="mt-1 text-lg font-semibold text-accent">{money(result.tax)}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{t("effectiveRate")}</p>
              <p className="mt-1 text-lg font-semibold text-text">
                {(result.effective * 100).toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{t("marginalRate")}</p>
              <p className="mt-1 text-lg font-semibold text-text">
                {(result.marginalRate * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          <h3 className="mt-8 text-sm font-semibold text-text">{t("bracketTableTitle")}</h3>
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">{t("rateCol")}</th>
                  <th className="px-3 py-2 font-medium">{t("incomeRangeCol")}</th>
                </tr>
              </thead>
              <tbody>
                {BRACKETS.map((bracket, index) => {
                  const next = index < BRACKETS.length - 1 ? BRACKETS[index + 1].threshold : null;
                  const active = bracket.rate === result.marginalRate && taxableIsInBracket(result.taxable, index);
                  return (
                    <tr
                      key={bracket.threshold}
                      className={`border-t border-border bg-surface ${
                        active ? "bg-accent/10" : ""
                      }`}
                    >
                      <td className="px-3 py-1.5 tabular-nums text-text">
                        {(bracket.rate * 100).toFixed(0)}%
                      </td>
                      <td className="px-3 py-1.5 tabular-nums text-muted">
                        {next ? `${money(bracket.threshold)} - ${money(next)}` : `${money(bracket.threshold)}+`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted">{t("invalid")}</p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}

function taxableIsInBracket(taxable: number, index: number): boolean {
  const low = BRACKETS[index].threshold;
  const high = index < BRACKETS.length - 1 ? BRACKETS[index + 1].threshold : Infinity;
  return taxable >= low && taxable < high;
}