"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const CURRENCIES = [
  "USD",
  "EUR",
  "TRY",
  "GBP",
  "JPY",
  "CNY",
  "AUD",
  "CAD",
  "CHF",
  "RUB",
];

const RATES_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  TRY: 34.5,
  GBP: 1.27,
  JPY: 149,
  CNY: 7.2,
  AUD: 0.65,
  CAD: 0.74,
  CHF: 1.13,
  RUB: 93,
};

function cleanNumber(value: string): number {
  const n = value.trim().replace(",", ".");
  return Number(n);
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("TRY");
  const [rateOverride, setRateOverride] = useState("");
  const t = useTranslations("comp.currencyConverter");
  const locale = useLocale();

  const defaultRate = useMemo(() => {
    const f = RATES_TO_USD[from] ?? 1;
    const d = RATES_TO_USD[to] ?? 1;
    if (!f || !d) return 0;
    return d / f;
  }, [from, to]);

  const rate = useMemo(() => {
    const override = cleanNumber(rateOverride);
    return Number.isFinite(override) && override > 0 ? override : defaultRate;
  }, [rateOverride, defaultRate]);

  const result = useMemo(() => {
    const value = cleanNumber(amount);
    if (!Number.isFinite(value) || value <= 0) return null;
    if (!Number.isFinite(rate) || rate <= 0) return null;
    return value * rate;
  }, [amount, rate]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: to,
        maximumFractionDigits: to === "JPY" ? 0 : 2,
      }),
    [locale, to]
  );

  function swap() {
    setFrom(to);
    setTo(from);
    setRateOverride("");
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cur-amount"
            className="block text-sm font-medium text-text"
          >
            {t("amountLabel")}
          </label>
          <input
            id="cur-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder={t("amountPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="cur-from"
              className="block text-sm font-medium text-text"
            >
              {t("fromLabel")}
            </label>
            <select
              id="cur-from"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="cur-to"
              className="block text-sm font-medium text-text"
            >
              {t("toLabel")}
            </label>
            <select
              id="cur-to"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-end gap-3">
        <div className="flex-1">
          <label
            htmlFor="cur-rate"
            className="block text-sm font-medium text-text"
          >
            {t("rateLabel")}
          </label>
          <input
            id="cur-rate"
            type="text"
            inputMode="decimal"
            value={rateOverride}
            onChange={(event) => setRateOverride(event.target.value)}
            placeholder={String(defaultRate)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <button
          type="button"
          onClick={swap}
          className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {t("swap")}
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>

      {result !== null && rate > 0 ? (
        <div className="mt-5 rounded-lg border border-border bg-bg px-5 py-4 text-center">
          <div className="text-xs text-muted">
            {t("result", {
              from: `${cleanNumber(amount)} ${from}`,
            })}
          </div>
          <div className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-accent">
            {formatter.format(result)}
          </div>
          <div className="mt-1 text-xs text-muted">
            {t("reverse", {
              to: `${formatter.format(result)} ${to}`,
            })}{" "}
            = {cleanNumber(amount)} {from}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <SampleButton
          onApply={() => {
            setAmount("100");
            setFrom("USD");
            setTo("TRY");
            setRateOverride("");
          }}
        />
      </div>
    </div>
  );
}