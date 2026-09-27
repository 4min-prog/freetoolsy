"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function dayDiff(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function DaysUntilCalculator() {
  const [start, setStart] = useState(today());
  const [end, setEnd] = useState(today());
  const t = useTranslations("comp.daysUntilCalculator");

  const totalDays = useMemo(() => {
    const from = new Date(`${start}T00:00:00`);
    const to = new Date(`${end}T00:00:00`);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
    return dayDiff(from, to);
  }, [start, end]);

  const weeks = totalDays === null ? null : Math.floor(Math.abs(totalDays) / 7);
  const remDays = totalDays === null ? null : Math.abs(totalDays) % 7;

  return (
    <div>
      <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="days-start"
            className="block text-sm font-medium text-text"
          >
            {t("startLabel")}
          </label>
          <input
            id="days-start"
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label
            htmlFor="days-end"
            className="block text-sm font-medium text-text"
          >
            {t("endLabel")}
          </label>
          <input
            id="days-end"
            type="date"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {totalDays !== null ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted">{t("totalDays")}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-text">
              {Math.abs(totalDays)} {totalDays < 0 ? t("past") : ""}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted">{t("weeksDays")}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-text">
              {weeks} {t("weeks")} {remDays} {t("days")}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface px-4 py-3 sm:col-span-1 col-span-2">
            <p className="text-xs text-muted">{t("direction")}</p>
            <p className="mt-1 text-lg font-medium text-text">
              {totalDays === 0
                ? t("sameDay")
                : totalDays > 0
                  ? t("future")
                  : t("pastNote")}
            </p>
          </div>
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