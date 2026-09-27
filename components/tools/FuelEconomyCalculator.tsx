"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Unit = "l100" | "mpg" | "kml";

const M_PER_GAL = 1.609344 / 3.785411784;

export default function FuelEconomyCalculator() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<Unit>("l100");
  const t = useTranslations("comp.fuelEconomyCalculator");

  const num = Number(value);
  const valid = value !== "" && !Number.isNaN(num) && num > 0;

  const l100 = valid ? (unit === "l100" ? num : unit === "mpg" ? 100 / (num * M_PER_GAL) : 100 / num) : 0;
  const mpg = valid ? 100 / (l100 * M_PER_GAL) : 0;
  const kml = valid ? 100 / l100 : 0;

  const card = (label: string, v: string) => (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-text">{v}</p>
    </div>
  );

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(["l100", "mpg", "kml"] as Unit[]).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
              unit === u
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface text-muted hover:border-strong"
            }`}
          >
            {u === "l100" ? "L/100 km" : u === "mpg" ? "MPG" : "km/L"}
          </button>
        ))}
      </div>

      <div className="mt-4 max-w-sm">
        <input
          id="fuel-economy"
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="0"
          className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {valid ? (
        <div className="mt-6 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
          {card("L/100 km", l100.toFixed(2))}
          {card("MPG", mpg.toFixed(1))}
          {card("km/L", kml.toFixed(2))}
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}