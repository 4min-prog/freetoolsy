"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

function formatResult(value: number): string {
  return String(Number(value.toFixed(4)));
}

export default function PxRemDonusturucu() {
  const [baseValue, setBaseValue] = useState("16");
  const [pxInput, setPxInput] = useState("");
  const [remInput, setRemInput] = useState("");
  const t = useTranslations("comp.pxRem");

  const base = useMemo(() => {
    const value = parseNumber(baseValue);
    return Number.isFinite(value) && value > 0 ? value : null;
  }, [baseValue]);

  const remOut = useMemo(() => {
    if (base === null) return "-";
    const px = parseNumber(pxInput);
    if (!Number.isFinite(px)) return "-";
    return formatResult(px / base);
  }, [base, pxInput]);

  const pxOut = useMemo(() => {
    if (base === null) return "-";
    const rem = parseNumber(remInput);
    if (!Number.isFinite(rem)) return "-";
    return formatResult(rem * base);
  }, [base, remInput]);

  return (
    <div>
      <label htmlFor="pxrem-base" className="block text-sm font-medium text-text">
        {t("baseLabel")}
      </label>
      <input
        id="pxrem-base"
        type="text"
        inputMode="decimal"
        value={baseValue}
        onChange={(event) => setBaseValue(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-48"
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-sm font-medium text-text">{t("pxToRemLabel")}</p>
          <div className="mt-3 flex items-center gap-2">
            <input
              id="pxrem-px"
              type="text"
              inputMode="decimal"
              value={pxInput}
              onChange={(event) => setPxInput(event.target.value)}
              aria-label={t("pxLabel")}
              className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <span className="shrink-0 text-xs text-muted">{t("pxLabel")}</span>
            <span className="shrink-0 text-sm text-muted">=</span>
            <span className="shrink-0 text-lg font-semibold tabular-nums tracking-tight text-accent">
              {remOut}
            </span>
            <span className="shrink-0 text-xs text-muted">{t("remLabel")}</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-sm font-medium text-text">{t("remToPxLabel")}</p>
          <div className="mt-3 flex items-center gap-2">
            <input
              id="pxrem-rem"
              type="text"
              inputMode="decimal"
              value={remInput}
              onChange={(event) => setRemInput(event.target.value)}
              aria-label={t("remLabel")}
              className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <span className="shrink-0 text-xs text-muted">{t("remLabel")}</span>
            <span className="shrink-0 text-sm text-muted">=</span>
            <span className="shrink-0 text-lg font-semibold tabular-nums tracking-tight text-accent">
              {pxOut}
            </span>
            <span className="shrink-0 text-xs text-muted">{t("pxLabel")}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SampleButton onApply={() => setPxInput(SAMPLES["px-rem-donusturucu"])} />
      </div>
    </div>
  );
}