"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

type Unit = "c" | "f" | "k";

function round(value: number): string {
  return String(Math.round(value * 1e6) / 1e6);
}

export default function TemperatureConverter() {
  const [c, setC] = useState("");
  const [f, setF] = useState("");
  const [k, setK] = useState("");
  const [copied, setCopied] = useState<"c" | "f" | "k" | null>(null);
  const t = useTranslations("comp.temperatureConverter");

  function hasValue() {
    return c !== "" || f !== "" || k !== "";
  }

  async function copy(unit: "c" | "f" | "k", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(unit);
      showToast();
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  function clearAll() {
    setC("");
    setF("");
    setK("");
    setCopied(null);
  }

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
          <div className="flex items-center justify-between">
            <label htmlFor="temp-c" className="block text-sm font-medium text-text">
              {t("celsius")}
            </label>
            <button
              type="button"
              onClick={() => copy("c", c)}
              disabled={!c}
              className="text-xs font-medium text-muted transition-colors hover:text-text disabled:opacity-50"
            >
              {copied === "c" ? t("copied") : t("copy")}
            </button>
          </div>
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
          <div className="flex items-center justify-between">
            <label htmlFor="temp-f" className="block text-sm font-medium text-text">
              {t("fahrenheit")}
            </label>
            <button
              type="button"
              onClick={() => copy("f", f)}
              disabled={!f}
              className="text-xs font-medium text-muted transition-colors hover:text-text disabled:opacity-50"
            >
              {copied === "f" ? t("copied") : t("copy")}
            </button>
          </div>
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
          <div className="flex items-center justify-between">
            <label htmlFor="temp-k" className="block text-sm font-medium text-text">
              {t("kelvin")}
            </label>
            <button
              type="button"
              onClick={() => copy("k", k)}
              disabled={!k}
              className="text-xs font-medium text-muted transition-colors hover:text-text disabled:opacity-50"
            >
              {copied === "k" ? t("copied") : t("copy")}
            </button>
          </div>
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

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={clearAll}
          disabled={!hasValue()}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}