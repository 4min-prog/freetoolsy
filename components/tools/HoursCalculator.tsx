"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

function toMinutes(time: string): number | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export default function HoursCalculator() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:30");
  const [nextDay, setNextDay] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.hoursCalculator");

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
    setStart("");
    setEnd("");
    setNextDay(false);
    setCopied(false);
  }

  const minutes = useMemo(() => {
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    if (startMin === null || endMin === null) return null;
    let diff = endMin - startMin;
    if (diff <= 0 && nextDay) diff += 24 * 60;
    if (diff <= 0) return null;
    return diff;
  }, [start, end, nextDay]);

  const hours = minutes === null ? null : Math.floor(minutes / 60);
  const restMinutes = minutes === null ? null : minutes % 60;
  const decimal = minutes === null ? null : Math.round((minutes / 60) * 100) / 100;

  return (
    <div>
      <div className="grid max-w-md grid-cols-2 gap-4">
        <div>
          <label htmlFor="hrs-start" className="block text-xs font-medium text-muted">
            {t("startLabel")}
          </label>
          <input
            id="hrs-start"
            type="time"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="hrs-end" className="block text-xs font-medium text-muted">
            {t("endLabel")}
          </label>
          <input
            id="hrs-end"
            type="time"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={nextDay}
          onChange={(event) => setNextDay(event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        {t("nextDay")}
      </label>

      {minutes !== null && hours !== null ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("hours")}</p>
            <p className="mt-1 text-lg font-semibold text-accent">
              {hours}h {restMinutes}m
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("totalMinutes")}</p>
            <p className="mt-1 text-lg font-semibold text-text">{minutes}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("decimalHours")}</p>
            <p className="mt-1 text-lg font-semibold text-text">{decimal}</p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">{t("invalid")}</p>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => copy(decimal === null ? "" : String(decimal))}
          disabled={decimal === null}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={!start && !end && !nextDay}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}