"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Unit = "c" | "f" | "k";

function round(value: number): string {
  return String(Math.round(value * 1e6) / 1e6);
}

export default function TemperatureConverter() {
  const [c, setC] = useState("");
  const [f, setF] = useState("");
  const [k, setK] = useState("");
  const t = useTranslations("comp.temperatureConverter");

  function update(source: Unit, raw: string) {
    const trimmed = raw.trim();
    if (trimmed === "") {
      setC("");
      setF("");
      setK("");
      return;
    }
    const value = Number(trimmed);
    if (!Number.isFinite(value)) {
      if (source === "c") {
        setC(raw);
        setF("");
        setK("");
      } else if (source === "f") {
        setF(raw);
        setC("");
        setK("");
      } else {
        setK(raw);
        setC("");
        setF("");
      }
      return;
    }
    if (source === "c") {
      setC(raw);
      setF(round((value * 9) / 5 + 32));
      setK(round(value + 273.15));
    } else if (source === "f") {
      setF(raw);
      setC(round(((value - 32) * 5) / 9));
      setK(round(((value - 32) * 5) / 9 + 273.15));
    } else {
      setK(raw);
      setC(round(value - 273.15));
      setF(round(((value - 273.15) * 9) / 5 + 32));
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="temp-c" className="block text-sm font-medium text-text">
            {t("celsius")}
          </label>
          <input
            id="temp-c"
            type="text"
            inputMode="decimal"
            value={c}
            onChange={(event) => update("c", event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="temp-f" className="block text-sm font-medium text-text">
            {t("fahrenheit")}
          </label>
          <input
            id="temp-f"
            type="text"
            inputMode="decimal"
            value={f}
            onChange={(event) => update("f", event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="temp-k" className="block text-sm font-medium text-text">
            {t("kelvin")}
          </label>
          <input
            id="temp-k"
            type="text"
            inputMode="decimal"
            value={k}
            onChange={(event) => update("k", event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}