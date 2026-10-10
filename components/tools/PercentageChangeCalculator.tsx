"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

export default function PercentageChangeCalculator() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.percentageChangeCalculator");

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function clear() {
    setFrom("");
    setTo("");
    setCopied(false);
  }

  const a = Number(from);
  const b = Number(to);
  const valid = from !== "" && to !== "" && !Number.isNaN(a) && !Number.isNaN(b);

  let change: number | null = null;
  let abs: number | null = null;
  let sign: "up" | "down" | null = null;
  if (valid) {
    abs = b - a;
    change = a !== 0 ? (abs / Math.abs(a)) * 100 : null;
    sign = abs > 0 ? "up" : abs < 0 ? "down" : null;
  }

  return (
    <div>
      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="pch-from"
            className="block text-sm font-medium text-text"
          >
            {t("fromLabel")}
          </label>
          <input
            id="pch-from"
            type="number"
            step="any"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            placeholder="0"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label
            htmlFor="pch-to"
            className="block text-sm font-medium text-text"
          >
            {t("toLabel")}
          </label>
          <input
            id="pch-to"
            type="number"
            step="any"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            placeholder="0"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {valid ? (
        <div className="mt-6 max-w-md rounded-lg border border-border bg-surface p-5">
          <div className="flex items-baseline gap-3">
            <span
              className={`text-3xl font-bold tabular-nums ${
                sign === "up" ? "text-accent" : ""
              }`}
            >
              {change === null ? "∞" : `${change > 0 ? "+" : ""}${change.toFixed(2)}%`}
            </span>
            {sign ? (
              <span className="text-sm text-muted">
                {sign === "up" ? t("increase") : t("decrease")}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm text-muted">
            {t("absolute", { value: abs!.toFixed(2) })}
          </p>
          {change === null ? (
            <p className="mt-2 text-xs text-muted">{t("zeroBase")}</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() =>
            copy(change === null ? "" : `${change > 0 ? "+" : ""}${change.toFixed(2)}%`)
          }
          disabled={change === null}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={from === "" && to === ""}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}