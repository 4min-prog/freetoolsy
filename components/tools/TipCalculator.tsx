"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const TIP_RATES = [5, 10, 15, 20, 25];

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

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState(10);
  const [split, setSplit] = useState("1");
  const t = useTranslations("comp.tipCalculator");

  const currency = useMemo(
    () => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }),
    []
  );

  const result = useMemo(() => {
    const billValue = parseNumber(bill);
    if (!Number.isFinite(billValue) || billValue < 0) return null;
    const splitValue = Math.floor(parseNumber(split));
    const people = Number.isFinite(splitValue) ? Math.max(1, splitValue) : 1;
    const tipAmount = billValue * (tip / 100);
    const total = billValue + tipAmount;
    return { tipAmount, total, perPerson: total / people };
  }, [bill, tip, split]);

  const tiles = [
    { key: "tipAmount", label: t("tipAmount"), value: result ? currency.format(result.tipAmount) : "-" },
    { key: "totalLabel", label: t("totalLabel"), value: result ? currency.format(result.total) : "-" },
    { key: "perPerson", label: t("perPerson"), value: result ? currency.format(result.perPerson) : "-" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bahsis-tutar" className="block text-sm font-medium text-text">
            {t("billLabel")}
          </label>
          <input
            id="bahsis-tutar"
            type="text"
            inputMode="decimal"
            value={bill}
            onChange={(event) => setBill(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <SampleButton onApply={() => { setBill("480"); setTip(15); setSplit("3"); }} />
          </div>
        </div>
        <div>
          <label htmlFor="bahsis-kisi" className="block text-sm font-medium text-text">
            {t("splitLabel")}
          </label>
          <input
            id="bahsis-kisi"
            type="text"
            inputMode="numeric"
            value={split}
            onChange={(event) => setSplit(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label htmlFor="bahsis-oran" className="mt-5 block text-sm font-medium text-text">
        {t("tipLabel")}
      </label>
      <select
        id="bahsis-oran"
        value={tip}
        onChange={(event) => setTip(Number(event.target.value))}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none sm:w-auto"
      >
        {TIP_RATES.map((option) => (
          <option key={option} value={option}>
            %{option}
          </option>
        ))}
      </select>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {tiles.map((tile) => (
          <Stat key={tile.key} label={tile.label} value={tile.value} />
        ))}
      </div>
    </div>
  );
}