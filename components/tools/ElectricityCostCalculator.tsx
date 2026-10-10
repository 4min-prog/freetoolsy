"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

export default function ElectricityCostCalculator() {
  const [watts, setWatts] = useState("");
  const [hours, setHours] = useState("");
  const [days, setDays] = useState("");
  const [price, setPrice] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.electricityCostCalculator");

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function clear() {
    setWatts("");
    setHours("");
    setDays("");
    setPrice("");
    setCopied(false);
  }

  const w = Number(watts);
  const h = Number(hours);
  const d = Number(days);
  const p = Number(price);
  const valid =
    watts !== "" && hours !== "" && days !== "" && price !== "" &&
    !Number.isNaN(w) && !Number.isNaN(h) && !Number.isNaN(d) && !Number.isNaN(p);

  const monthly = valid ? (w / 1000) * h * d : 0;
  const yearly = monthly * 12;
  const costMonthly = monthly * p;
  const costYearly = yearly * p;

  const card = (label: string, v: string) => (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-text">{v}</p>
    </div>
  );

  return (
    <div>
      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="elec-watts" className="block text-sm font-medium text-text">
            {t("wattsLabel")}
          </label>
          <input
            id="elec-watts"
            type="number"
            min="0"
            step="any"
            value={watts}
            onChange={(event) => setWatts(event.target.value)}
            placeholder="60"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="elec-hours" className="block text-sm font-medium text-text">
            {t("hoursLabel")}
          </label>
          <input
            id="elec-hours"
            type="number"
            min="0"
            step="any"
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            placeholder="5"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="elec-days" className="block text-sm font-medium text-text">
            {t("daysLabel")}
          </label>
          <input
            id="elec-days"
            type="number"
            min="0"
            step="any"
            value={days}
            onChange={(event) => setDays(event.target.value)}
            placeholder="30"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="elec-price" className="block text-sm font-medium text-text">
            {t("priceLabel")}
          </label>
          <input
            id="elec-price"
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="0.30"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {valid ? (
        <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
          {card(t("monthly"), `${monthly.toFixed(2)} kWh`)}
          {card(t("yearly"), `${yearly.toFixed(1)} kWh`)}
          {card(t("costMonthly"), `${costMonthly.toFixed(2)} ${t("currency")}`)}
          {card(t("costYearly"), `${costYearly.toFixed(1)} ${t("currency")}`)}
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => copy(valid ? `${costMonthly.toFixed(2)} ${t("currency")}` : "")}
          disabled={!valid}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={!watts && !hours && !days && !price}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}