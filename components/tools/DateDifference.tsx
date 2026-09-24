"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const DAY_MS = 86400000;

function todayInput(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function DateDifference() {
  const [start, setStart] = useState(todayInput());
  const [end, setEnd] = useState(todayInput());
  const t = useTranslations("comp.dateDifference");
  const locale = useLocale();

  const result = useMemo(() => {
    const a = new Date(`${start}T00:00:00`);
    const b = new Date(`${end}T00:00:00`);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
    const ms = Math.abs(b.getTime() - a.getTime());
    const totalDays = Math.floor(ms / DAY_MS);
    const years = Math.floor(totalDays / 365.2425);
    const rem = totalDays - Math.floor(years * 365.2425);
    const months = Math.floor(rem / 30.4368);
    const days = Math.floor(rem - months * 30.4368 + 0.00001);
    const weeks = Math.floor(totalDays / 7);
    const hours = totalDays * 24;
    const minutes = hours * 60;
    return {
      years,
      months,
      days,
      weeks,
      totalDays,
      hours,
      minutes,
    };
  }, [start, end]);

  const rows = result
    ? [
        { key: "totalDays", value: result.totalDays },
        { key: "weeks", value: result.weeks },
        {
          key: "monthsAvg",
          value: Math.floor(result.totalDays / 30.4368),
        },
        { key: "hours", value: result.hours },
        { key: "minutes", value: result.minutes },
      ]
    : [];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tarih-baslangic" className="block text-sm font-medium text-text">
            {t("start")}
          </label>
          <input
            id="tarih-baslangic"
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <SampleButton onApply={() => { setStart("2024-01-01"); setEnd("2026-09-23"); }} />
          </div>
        </div>
        <div>
          <label htmlFor="tarih-bitis" className="block text-sm font-medium text-text">
            {t("end")}
          </label>
          <input
            id="tarih-bitis"
            type="date"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {result ? (
        <div className="mt-5 rounded-lg border border-border bg-bg p-5">
          <p className="text-sm font-medium text-text">
            {t("difference")}{" "}
            <span className="font-semibold tabular-nums text-accent">
              {t("ymd", {
                years: result.years,
                months: result.months,
                days: result.days,
              })}
            </span>
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {rows.map((row) => (
              <div key={row.key} className="bg-surface px-4 py-3">
                <dt className="text-xs text-muted">{t(row.key)}</dt>
                <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
                  {row.value.toLocaleString(locale)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <p role="alert" className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger">
          {t("invalid")}
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}