"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const MAX_TABLE_MONTHS = 360;

type ScheduleRow = {
  month: number;
  principalPart: number;
  interestPart: number;
  balance: number;
};

type Result = {
  payment: number;
  total: number;
  interest: number;
  schedule: ScheduleRow[] | null;
};

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-3 text-center">
      <div className="text-xl font-semibold tabular-nums tracking-tight text-text">
        {props.value}
      </div>
      <div className="mt-1 text-xs text-muted">{props.label}</div>
    </div>
  );
}

export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.loanEmiCalculator");
  const locale = useLocale();

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 2,
      }),
    [locale]
  );

  const result = useMemo<Result | null>(() => {
    const p = parseNumber(principal);
    const annual = parseNumber(rate);
    const n = Math.floor(parseNumber(months));
    if (!Number.isFinite(p) || p <= 0) return null;
    if (!Number.isFinite(annual) || annual < 0) return null;
    if (!Number.isFinite(n) || n <= 0) return null;
    const r = annual / 100 / 12;
    if (r === 0) {
      const payment = p / n;
      return { payment, total: p, interest: 0, schedule: null };
    }
    const factor = Math.pow(1 + r, n);
    if (!Number.isFinite(factor)) return null;
    const payment = (p * r * factor) / (factor - 1);
    if (!Number.isFinite(payment) || payment <= 0) return null;
    const total = payment * n;
    const schedule: ScheduleRow[] = [];
    let balance = p;
    for (let i = 1; i <= n && i <= MAX_TABLE_MONTHS; i++) {
      const interestPart = balance * r;
      const principalPart = payment - interestPart;
      balance -= principalPart;
      schedule.push({
        month: i,
        principalPart: Math.max(principalPart, 0),
        interestPart,
        balance: Math.max(balance, 0),
      });
    }
    return { payment, total, interest: total - p, schedule };
  }, [principal, rate, months]);

  function handleCopy() {
    if (!result) return;
    navigator.clipboard
      .writeText(currency.format(result.payment))
      .then(() => {
        setCopied(true); showToast();
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  const tiles = [
    { key: "monthlyPayment", label: t("monthlyPayment"), value: result ? currency.format(result.payment) : "-" },
    { key: "totalPayment", label: t("totalPayment"), value: result ? currency.format(result.total) : "-" },
    { key: "totalInterest", label: t("totalInterest"), value: result ? currency.format(result.interest) : "-" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kredi-emi-anapara" className="block text-sm font-medium text-text">
            {t("principalLabel")}
          </label>
          <input
            id="kredi-emi-anapara"
            type="text"
            inputMode="decimal"
            value={principal}
            onChange={(event) => setPrincipal(event.target.value)}
            placeholder={t("principalPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <SampleButton onApply={() => { setPrincipal("500000"); setRate("2.49"); setMonths("120"); }} />
          </div>
        </div>
        <div>
          <label htmlFor="kredi-emi-faiz" className="block text-sm font-medium text-text">
            {t("interestLabel")}
          </label>
          <input
            id="kredi-emi-faiz"
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            placeholder={t("interestPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label htmlFor="kredi-emi-ay" className="mt-5 block text-sm font-medium text-text">
        {t("monthsLabel")}
      </label>
      <input
        id="kredi-emi-ay"
        type="text"
        inputMode="numeric"
        value={months}
        onChange={(event) => setMonths(event.target.value)}
        placeholder={t("monthsPlaceholder")}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {tiles.map((tile) => (
          <Stat key={tile.key} label={tile.label} value={tile.value} />
        ))}
      </div>

      {result ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {copied ? t("copied") : t("copy")}
          </button>

          {result.schedule ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowTable((current) => !current)}
                className="text-sm font-medium text-accent hover:underline"
              >
                {showTable ? t("hideAmortization") : t("showAmortization")}
              </button>
              {showTable ? (
                <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-surface-2 text-xs text-muted">
                      <tr>
                        <th className="px-3 py-2 font-medium">{t("monthCol")}</th>
                        <th className="px-3 py-2 font-medium">{t("paymentCol")}</th>
                        <th className="px-3 py-2 font-medium">{t("principalCol")}</th>
                        <th className="px-3 py-2 font-medium">{t("interestCol")}</th>
                        <th className="px-3 py-2 font-medium">{t("balanceCol")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr key={row.month} className="border-t border-border bg-surface">
                          <td className="px-3 py-1.5 tabular-nums text-muted">{row.month}</td>
                          <td className="px-3 py-1.5 tabular-nums text-text">
                            {currency.format(row.principalPart + row.interestPart)}
                          </td>
                          <td className="px-3 py-1.5 tabular-nums text-text">
                            {currency.format(row.principalPart)}
                          </td>
                          <td className="px-3 py-1.5 tabular-nums text-text">
                            {currency.format(row.interestPart)}
                          </td>
                          <td className="px-3 py-1.5 tabular-nums text-text">
                            {currency.format(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}
    </div>
  );
}