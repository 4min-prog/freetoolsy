"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

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

export default function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const t = useTranslations("comp.discountCalculator");

  const currency = useMemo(
    () => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }),
    []
  );
  const number = useMemo(
    () => new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }),
    []
  );

  const result = useMemo(() => {
    const original = parseNumber(price);
    const rate = parseNumber(discount);
    if (!Number.isFinite(original) || original < 0) return null;
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) return null;
    const amount = original * (rate / 100);
    return { amount, final: original - amount, percent: rate };
  }, [price, discount]);

  const tiles = [
    { key: "discountAmount", label: t("discountAmount"), value: result ? currency.format(result.amount) : "-" },
    { key: "finalLabel", label: t("finalLabel"), value: result ? currency.format(result.final) : "-" },
    { key: "savedLabel", label: t("savedLabel"), value: result ? `${number.format(result.percent)}%` : "-" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="indirim-fiyat" className="block text-sm font-medium text-text">
            {t("originalLabel")}
          </label>
          <input
            id="indirim-fiyat"
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <SampleButton onApply={() => { setPrice("1200"); setDiscount("25"); }} />
          </div>
        </div>
        <div>
          <label htmlFor="indirim-oran" className="block text-sm font-medium text-text">
            {t("discountLabel")}
          </label>
          <input
            id="indirim-oran"
            type="text"
            inputMode="decimal"
            value={discount}
            onChange={(event) => setDiscount(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {tiles.map((tile) => (
          <Stat key={tile.key} label={tile.label} value={tile.value} />
        ))}
      </div>
    </div>
  );
}