"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

type Unit = "deg" | "rad" | "grad";

function round(value: number): string {
  return String(Math.round(value * 1e8) / 1e8);
}

export default function AngleConverter() {
  const [deg, setDeg] = useState("");
  const [rad, setRad] = useState("");
  const [grad, setGrad] = useState("");
  const [copied, setCopied] = useState<"deg" | "rad" | "grad" | null>(null);
  const t = useTranslations("comp.angleConverter");

  function hasValue() {
    return deg !== "" || rad !== "" || grad !== "";
  }

  async function copy(unit: "deg" | "rad" | "grad", value: string) {
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
    setDeg("");
    setRad("");
    setGrad("");
    setCopied(null);
  }

  function update(source: Unit, raw: string) {
    const trimmed = raw.trim();
    if (trimmed === "") {
      setDeg("");
      setRad("");
      setGrad("");
      return;
    }
    const value = Number(trimmed);
    if (!Number.isFinite(value)) {
      if (source === "deg") {
        setDeg(raw);
        setRad("");
        setGrad("");
      } else if (source === "rad") {
        setRad(raw);
        setDeg("");
        setGrad("");
      } else {
        setGrad(raw);
        setDeg("");
        setRad("");
      }
      return;
    }
    if (source === "deg") {
      setDeg(raw);
      setRad(round((value * Math.PI) / 180));
      setGrad(round((value * 10) / 9));
    } else if (source === "rad") {
      setRad(raw);
      setDeg(round((value * 180) / Math.PI));
      setGrad(round((value * 200) / Math.PI));
    } else {
      setGrad(raw);
      setDeg(round((value * 9) / 10));
      setRad(round((value * Math.PI) / 200));
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="angle-deg" className="block text-sm font-medium text-text">
              {t("degrees")}
            </label>
            <button
              type="button"
              onClick={() => copy("deg", deg)}
              disabled={!deg}
              className="text-xs font-medium text-muted transition-colors hover:text-text disabled:opacity-50"
            >
              {copied === "deg" ? t("copied") : t("copy")}
            </button>
          </div>
          <input
            id="angle-deg"
            type="text"
            inputMode="decimal"
            value={deg}
            onChange={(event) => update("deg", event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="angle-rad" className="block text-sm font-medium text-text">
              {t("radians")}
            </label>
            <button
              type="button"
              onClick={() => copy("rad", rad)}
              disabled={!rad}
              className="text-xs font-medium text-muted transition-colors hover:text-text disabled:opacity-50"
            >
              {copied === "rad" ? t("copied") : t("copy")}
            </button>
          </div>
          <input
            id="angle-rad"
            type="text"
            inputMode="decimal"
            value={rad}
            onChange={(event) => update("rad", event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="angle-grad" className="block text-sm font-medium text-text">
              {t("gradians")}
            </label>
            <button
              type="button"
              onClick={() => copy("grad", grad)}
              disabled={!grad}
              className="text-xs font-medium text-muted transition-colors hover:text-text disabled:opacity-50"
            >
              {copied === "grad" ? t("copied") : t("copy")}
            </button>
          </div>
          <input
            id="angle-grad"
            type="text"
            inputMode="decimal"
            value={grad}
            onChange={(event) => update("grad", event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
        <p className="text-muted">180° = π rad</p>
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