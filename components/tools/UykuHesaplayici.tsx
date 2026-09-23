"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const CYCLE_MIN = 90;
const FALL_ASLEEP_MIN = 15;
const CYCLE_COUNTS = [5, 6];

type Mode = "wake" | "bed";

type Suggestion = {
  cycles: number;
  bed: string;
  wake: string;
};

function timeToMinutes(value: string): number | null {
  if (!value) return null;
  const parts = value.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return (hours % 24) * 60 + (minutes % 60);
}

function formatMinutes(total: number): string {
  const normalized = ((total % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export default function UykuHesaplayici() {
  const [mode, setMode] = useState<Mode>("wake");
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.uykuHesaplayici");

  const suggestions = useMemo<Suggestion[]>(() => {
    const minutes = timeToMinutes(time);
    if (minutes === null) return [];
    if (mode === "wake") {
      return CYCLE_COUNTS.map((count) => ({
        cycles: count,
        bed: formatMinutes(minutes - (count * CYCLE_MIN + FALL_ASLEEP_MIN)),
        wake: formatMinutes(minutes),
      }));
    }
    return CYCLE_COUNTS.map((count) => ({
      cycles: count,
      bed: formatMinutes(minutes),
      wake: formatMinutes(minutes + (count * CYCLE_MIN + FALL_ASLEEP_MIN)),
    }));
  }, [mode, time]);

  function handleCopy() {
    if (suggestions.length === 0) return;
    const lines = suggestions.map(
      (item) =>
        `${t("bedAt")} ${item.bed} — ${t("wakeAt")} ${item.wake} (${item.cycles} ${t("cycles")})`
    );
    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={t("tabAria")}
          className="flex gap-1 rounded-lg border border-border bg-surface-2 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "wake"}
            onClick={() => setMode("wake")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "wake" ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
            }`}
          >
            {t("tabWake")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "bed"}
            onClick={() => setMode("bed")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "bed" ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
            }`}
          >
            {t("tabBed")}
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={suggestions.length === 0}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>

      <label htmlFor="uyku-saat" className="mt-5 block text-sm font-medium text-text">
        {mode === "wake" ? t("wakeLabel") : t("bedLabel")}
      </label>
      <input
        id="uyku-saat"
        type="time"
        value={time}
        onChange={(event) => setTime(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>

      {suggestions.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-border">
          {suggestions.map((item) => (
            <div
              key={item.cycles}
              className="flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3 first:border-t-0"
            >
              <span className="text-sm text-muted">
                {t("bedAt")}{" "}
                <span className="font-medium tabular-nums text-text">{item.bed}</span> — {t("wakeAt")}{" "}
                <span className="font-medium tabular-nums text-text">{item.wake}</span>
              </span>
              <span className="shrink-0 rounded-md bg-surface-2 px-2 py-1 text-[11px] font-medium tabular-nums text-muted">
                {item.cycles} {t("cycles")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}
    </div>
  );
}