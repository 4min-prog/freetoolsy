"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

const UNITS = ["B", "KB", "MB", "GB", "TB"] as const;
type UnitName = (typeof UNITS)[number];

function formatNumber(value: number): string {
  if (Math.abs(value) >= 1000000000) return value.toExponential(6);
  return String(Math.round(value * 1e6) / 1e6);
}

export default function DataSizeConverter() {
  const [raw, setRaw] = useState("");
  const [unit, setUnit] = useState<UnitName>("MB");
  const [base, setBase] = useState<"1000" | "1024">("1000");
  const [copied, setCopied] = useState<number | null>(null);
  const t = useTranslations("comp.dataSizeConverter");

  async function copy(value: string, index: number) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(index);
      showToast();
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  const parsed = Number(raw);
  const valid = /^[0-9]*\.?[0-9]+$/.test(raw.trim()) && Number.isFinite(parsed);
  const factor = base === "1000" ? 1000 : 1024;
  const bytes = valid ? parsed * Math.pow(factor, UNITS.indexOf(unit)) : 0;

  const rows = UNITS.map((name, index) => {
    const size = valid ? bytes / Math.pow(factor, index) : 0;
    return { name, size };
  });

  return (
    <div>
      <div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="dsc-input" className="block text-sm font-medium text-text">
              {t("valueLabel")}
            </label>
            <input
              id="dsc-input"
              type="text"
              inputMode="decimal"
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              className="mt-2 w-40 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label htmlFor="dsc-unit" className="block text-sm font-medium text-text">
              {t("unitLabel")}
            </label>
            <select
              id="dsc-unit"
              value={unit}
              onChange={(event) => setUnit(event.target.value as UnitName)}
              className="mt-2 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {UNITS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dsc-base" className="block text-sm font-medium text-text">
              {t("baseLabel")}
            </label>
            <select
              id="dsc-base"
              value={base}
              onChange={(event) => setBase(event.target.value as "1000" | "1024")}
              className="mt-2 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="1000">{t("decimalBase")}</option>
              <option value="1024">{t("binaryBase")}</option>
            </select>
          </div>
        </div>
      </div>

      {valid ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">{t("unitCol")}</th>
                <th className="px-3 py-2 text-right font-medium">{t("sizeCol")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.name} className="border-t border-border bg-surface">
                  <td className="px-3 py-1.5 font-medium text-text">
                    {row.name}
                    {index === UNITS.indexOf(unit) ? (
                      <span className="ml-2 text-xs text-accent">{t("source")}</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-muted">{formatNumber(row.size)}</span>
                      <button
                        type="button"
                        onClick={() => copy(`${formatNumber(row.size)} ${row.name}`, index)}
                        className="text-xs font-medium text-muted transition-colors hover:text-text"
                      >
                        {copied === index ? t("copied") : t("copy")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setRaw("");
            setCopied(null);
          }}
          disabled={!raw.trim()}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}