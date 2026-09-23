"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const GRADES = [
  { value: "A+", points: 4.0, percent: 96 },
  { value: "A", points: 4.0, percent: 92 },
  { value: "A-", points: 3.7, percent: 89 },
  { value: "B+", points: 3.3, percent: 86 },
  { value: "B", points: 3.0, percent: 82 },
  { value: "B-", points: 2.7, percent: 79 },
  { value: "C+", points: 2.3, percent: 76 },
  { value: "C", points: 2.0, percent: 72 },
  { value: "C-", points: 1.7, percent: 69 },
  { value: "D+", points: 1.3, percent: 66 },
  { value: "D", points: 1.0, percent: 62 },
  { value: "F", points: 0, percent: 0 },
];

type Row = { id: number; credits: string; grade: string };

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

export default function NotOrtalamasi() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, credits: "1", grade: "B+" }]);
  const [usePercent, setUsePercent] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.notOrtalamasi");
  const locale = useLocale();

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
    [locale]
  );

  function addRow() {
    setRows((current) => [
      ...current,
      {
        id: current.length ? current[current.length - 1].id + 1 : 1,
        credits: "1",
        grade: "B+",
      },
    ]);
  }

  function updateRow(id: number, patch: Partial<Row>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeRow(id: number) {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));
  }

  const result = useMemo(() => {
    let points = 0;
    let percentPoints = 0;
    let totalCredits = 0;
    for (const row of rows) {
      const credits = Math.abs(parseNumber(row.credits));
      const safeCredits = Number.isFinite(credits) && credits > 0 ? credits : 0;
      const grade = GRADES.find((item) => item.value === row.grade) ?? GRADES[0];
      points += grade.points * safeCredits;
      percentPoints += grade.percent * safeCredits;
      totalCredits += safeCredits;
    }
    if (totalCredits <= 0) return null;
    return {
      gpa: points / totalCredits,
      percent: percentPoints / totalCredits,
      totalCredits,
    };
  }, [rows]);

  function handleCopy() {
    if (!result) return;
    const percentPart = usePercent ? ` • ${t("avg100")}: ${result.percent.toFixed(1)}` : "";
    const text = `${t("gpa")}: ${result.gpa.toFixed(2)} • ${t("totalCredits")}: ${formatter.format(
      result.totalCredits
    )}${percentPart}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text">{t("courseLabel")}</p>
        <button
          type="button"
          onClick={addRow}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("addRow")}
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_1.4fr_auto] items-center gap-2">
            <div>
              <label htmlFor={`not-ort-${row.id}-kredi`} className="sr-only">
                {t("creditsLabel")}
              </label>
              <input
                id={`not-ort-${row.id}-kredi`}
                type="text"
                inputMode="decimal"
                value={row.credits}
                onChange={(event) => updateRow(row.id, { credits: event.target.value })}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label htmlFor={`not-ort-${row.id}-not`} className="sr-only">
                {t("gradeLabel")}
              </label>
              <select
                id={`not-ort-${row.id}-not`}
                value={row.grade}
                onChange={(event) => updateRow(row.id, { grade: event.target.value })}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {GRADES.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.value} — {grade.points.toFixed(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              disabled={rows.length === 1}
              aria-label={t("removeRow")}
              className="rounded-lg border border-border bg-surface px-2.5 py-2 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
            >
              {t("removeLabel")}
            </button>
          </div>
        ))}
      </div>

      <label htmlFor="not-ort-yuzde" className="mt-5 block text-sm font-medium text-text">
        {t("percentScale")}
      </label>
      <select
        id="not-ort-yuzde"
        value={usePercent ? "on" : "off"}
        onChange={(event) => setUsePercent(event.target.value === "on")}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none sm:w-auto"
      >
        <option value="off">{t("percentOff")}</option>
        <option value="on">{t("percentOn")}</option>
      </select>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>

      {result ? (
        <div className="mt-5">
          <div className="rounded-lg border border-border bg-bg p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-text">
                {result.gpa.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-accent">{t("gpa")}</span>
            </div>
            {usePercent ? (
              <p className="mt-2 text-sm tabular-nums text-muted">
                {t("avg100")}: {result.percent.toFixed(1)}
              </p>
            ) : null}
            <p className="mt-2 text-sm tabular-nums text-muted">
              {t("totalCredits")}: {formatter.format(result.totalCredits)}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}
    </div>
  );
}