"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function toNumber(raw: string): number | null {
  const value = Number(raw.trim());
  return raw.trim() === "" || !Number.isFinite(value) || value < 0 ? null : value;
}

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState("");
  const [consumption, setConsumption] = useState("");
  const [price, setPrice] = useState("");
  const t = useTranslations("comp.fuelCostCalculator");

  const result = useMemo(() => {
    const d = toNumber(distance);
    const c = toNumber(consumption);
    const p = toNumber(price);
    if (d === null || c === null || p === null) return null;
    const liters = (d / 100) * c;
    const cost = liters * p;
    return {
      liters: Math.round(liters * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      perKm: Math.round((cost / d) * 10000) / 10000,
    };
  }, [distance, consumption, price]);

  const inputClass =
    "mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="fuel-distance" className="block text-sm font-medium text-text">
            {t("distance")}
          </label>
          <input
            id="fuel-distance"
            type="text"
            inputMode="decimal"
            placeholder="100"
            value={distance}
            onChange={(event) => setDistance(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="fuel-consumption" className="block text-sm font-medium text-text">
            {t("consumption")}
          </label>
          <input
            id="fuel-consumption"
            type="text"
            inputMode="decimal"
            placeholder="7"
            value={consumption}
            onChange={(event) => setConsumption(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="fuel-price" className="block text-sm font-medium text-text">
            {t("fuelPrice")}
          </label>
          <input
            id="fuel-price"
            type="text"
            inputMode="decimal"
            placeholder="45"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {result !== null ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("totalCost")}</p>
            <p className="mt-1 text-lg font-semibold text-accent">{result.cost}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("totalLiters")}</p>
            <p className="mt-1 text-lg font-semibold text-text">{result.liters}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("costPerKm")}</p>
            <p className="mt-1 text-lg font-semibold text-text">{result.perKm}</p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">{t("waiting")}</p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}