"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const UNITS = ["px", "rem", "em", "%", "vw", "vh"] as const;
type Unit = (typeof UNITS)[number];

const UNIT_KEYS: Record<Unit, string> = {
  px: "units_px",
  rem: "units_rem",
  em: "units_em",
  "%": "units_percent",
  vw: "units_vw",
  vh: "units_vh",
};

function toNumber(value: string): number {
  return Number(value.replace(",", "."));
}

function formatValue(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 1000000) return value.toExponential(4);
  return String(Math.round(value * 100) / 100);
}

export default function CssUnitsConverter() {
  const [raw, setRaw] = useState("16");
  const [fromUnit, setFromUnit] = useState<Unit>("px");
  const [baseSize, setBaseSize] = useState("16");
  const [viewportW, setViewportW] = useState("1920");
  const [viewportH, setViewportH] = useState("1080");
  const t = useTranslations("comp.cssUnitsConverter");

  const result = useMemo(() => {
    const value = toNumber(raw);
    const base = toNumber(baseSize);
    const width = toNumber(viewportW);
    const height = toNumber(viewportH);
    if (
      !Number.isFinite(value) ||
      base <= 0 ||
      width <= 0 ||
      height <= 0
    ) {
      return null;
    }
    let px: number;
    switch (fromUnit) {
      case "rem":
      case "em":
        px = value * base;
        break;
      case "%":
        px = (value / 100) * base;
        break;
      case "vw":
        px = (value / 100) * width;
        break;
      case "vh":
        px = (value / 100) * height;
        break;
      default:
        px = value;
    }
    return {
      px: px,
      rem: px / base,
      em: px / base,
      percent: (px / base) * 100,
      vw: (px / width) * 100,
      vh: (px / height) * 100,
    };
  }, [raw, fromUnit, baseSize, viewportW, viewportH]);

  return (
    <div>
      <div className="grid max-w-xl gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="cuc-value" className="block text-xs font-medium text-muted">
            {t("valueLabel")}
          </label>
          <input
            id="cuc-value"
            type="text"
            inputMode="decimal"
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="cuc-from" className="block text-xs font-medium text-muted">
            {t("fromUnit")}
          </label>
          <select
            id="cuc-from"
            value={fromUnit}
            onChange={(event) => setFromUnit(event.target.value as Unit)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cuc-base" className="block text-xs font-medium text-muted">
            {t("baseSize")}
          </label>
          <input
            id="cuc-base"
            type="text"
            inputMode="decimal"
            value={baseSize}
            onChange={(event) => setBaseSize(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="cuc-vw" className="block text-xs font-medium text-muted">
            {t("viewportW")}
          </label>
          <input
            id="cuc-vw"
            type="text"
            inputMode="decimal"
            value={viewportW}
            onChange={(event) => setViewportW(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="cuc-vh" className="block text-xs font-medium text-muted">
            {t("viewportH")}
          </label>
          <input
            id="cuc-vh"
            type="text"
            inputMode="decimal"
            value={viewportH}
            onChange={(event) => setViewportH(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {result ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">{t("unitCol")}</th>
                <th className="px-3 py-2 text-right font-medium">{t("valueCol")}</th>
              </tr>
            </thead>
            <tbody>
              {UNITS.map((unit) => (
                <tr key={unit} className="border-t border-border bg-surface">
                  <td className="px-3 py-1.5 font-medium text-text">
                    {t(UNIT_KEYS[unit])}
                    {unit === fromUnit ? (
                      <span className="ml-2 text-xs text-accent">{t("source")}</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted">
                    {formatValue(unit === "%" ? result.percent : unit === "vw" ? result.vw : unit === "vh" ? result.vh : result[unit])} {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">{t("invalid")}</p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}