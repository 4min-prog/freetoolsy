"use client";

import { useEffect, useMemo, useState } from "react";
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
  "AED",
  "SAR",
  "KWD",
  "QAR",
  "IRR",
  "KRW",
  "SGD",
  "NOK",
  "SEK",
  "DKK",
  "PLN",
  "CZK",
  "HUF",
  "RON",
  "ILS",
  "ZAR",
  "BRL",
  "MXN",
  "INR",
  "PKR",
  "NZD",
];

const RATES_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.88,
  TRY: 48.9,
  GBP: 0.76,
  JPY: 158.7,
  CNY: 6.72,
  AUD: 1.43,
  CAD: 1.41,
  CHF: 0.83,
  RUB: 84.5,
  AED: 3.67,
  SAR: 3.75,
  KWD: 0.31,
  QAR: 3.64,
  IRR: 42100,
  KRW: 1390,
  SGD: 1.3,
  NOK: 10.6,
  SEK: 10.3,
  DKK: 6.55,
  PLN: 3.9,
  CZK: 22.5,
  HUF: 355,
  RON: 4.35,
  ILS: 3.55,
  ZAR: 13.8,
  BRL: 4.95,
  MXN: 17.4,
  INR: 83.1,
  PKR: 278,
  NZD: 1.55,
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
  const [ratesReady, setRatesReady] = useState(false);
  const [liveOk, setLiveOk] = useState(false);
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const t = useTranslations("comp.currencyConverter");
  const locale = useLocale();

  useEffect(() => {
    fetch("/api/rates")
      .then((response) => response.json())
      .then((data) => {
        setRates(data?.rates ?? null);
        setUpdatedAt(data?.updatedAt ?? null);
        setLiveOk(!!data?.live);
      })
      .catch(() => {
        setLiveOk(false);
      })
      .finally(() => setRatesReady(true));
  }, []);

  const defaultRate = useMemo(() => {
    const f = rates?.[from] ?? RATES_TO_USD[from] ?? 1;
    const d = rates?.[to] ?? RATES_TO_USD[to] ?? 1;
    if (!f || !d) return 0;
    return d / f;
  }, [from, to, rates]);

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

  const timeLabel = useMemo(() => {
    if (!updatedAt) return "";
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(updatedAt * 1000);
  }, [updatedAt, locale]);

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
    setTo(from);
    setFrom(to);
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

      <p className="mt-3 text-xs leading-relaxed text-muted">
        {ratesReady
          ? liveOk && updatedAt
            ? t("liveStatus", { time: timeLabel })
            : t("fallbackStatus")
          : t("note")}
      </p>

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