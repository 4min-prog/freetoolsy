"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type AmortRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

function toNumber(value: string): number {
  return Number(value.replace(",", "."));
}

function money(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState("350000");
  const [down, setDown] = useState("70000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const t = useTranslations("comp.mortgageCalculator");

  const result = useMemo(() => {
    const home = toNumber(price);
    const downPmt = toNumber(down);
    const annualRate = Number(rate) / 100;
    const term = Math.min(Math.max(Number(years) || 1, 1), 50);
    const loan = Math.max(home - downPmt, 0);
    if (!Number.isFinite(loan) || loan <= 0) return null;
    const months = term * 12;
    const monthlyRate = annualRate / 12;
    const payment =
      monthlyRate === 0
        ? loan / months
        : (loan * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
          (Math.pow(1 + monthlyRate, months) - 1);
    const rows: AmortRow[] = [];
    let balance = loan;
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = payment - interest;
      balance = Math.max(balance - principal, 0);
      rows.push({ month: i, payment, principal, interest, balance });
    }
    const totalPayment = payment * months;
    return {
      loan,
      payment,
      totalPayment,
      totalInterest: totalPayment - loan,
      rows,
    };
  }, [price, down, rate, years]);

  return (
    <div>
      <div className="grid max-w-xl gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mtg-price" className="block text-xs font-medium text-muted">
            {t("priceLabel")}
          </label>
          <input
            id="mtg-price"
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="mtg-down" className="block text-xs font-medium text-muted">
            {t("downLabel")}
          </label>
          <input
            id="mtg-down"
            type="text"
            inputMode="decimal"
            value={down}
            onChange={(event) => setDown(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="mtg-rate" className="block text-xs font-medium text-muted">
            {t("rateLabel")}
          </label>
          <input
            id="mtg-rate"
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="mtg-years" className="block text-xs font-medium text-muted">
            {t("termLabel")}
          </label>
          <input
            id="mtg-years"
            type="number"
            min={1}
            max={50}
            value={years}
            onChange={(event) => setYears(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {result ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{t("loanAmount")}</p>
              <p className="mt-1 text-lg font-semibold text-text">{money(result.loan)}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{t("monthlyPayment")}</p>
              <p className="mt-1 text-lg font-semibold text-accent">
                {money(result.payment)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{t("totalPayment")}</p>
              <p className="mt-1 text-lg font-semibold text-text">{money(result.totalPayment)}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{t("totalInterest")}</p>
              <p className="mt-1 text-lg font-semibold text-text">{money(result.totalInterest)}</p>
            </div>
          </div>

          <h3 className="mt-8 text-sm font-semibold text-text">{t("amortTitle")}</h3>
          <div className="mt-3 max-h-80 overflow-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-surface-2 text-xs text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">{t("monthCol")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("paymentCol")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("principalCol")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("interestCol")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("balanceCol")}</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.month} className="border-t border-border bg-surface">
                    <td className="px-3 py-1.5 tabular-nums text-muted">{row.month}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-text">
                      {money(row.payment)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-text">
                      {money(row.principal)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted">
                      {money(row.interest)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted">
                      {money(row.balance)}
                    </td>
                  </tr>
                ))}
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