"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function SavingsGoalCalculator() {
  const [goal, setGoal] = useState("100000");
  const [current, setCurrent] = useState("15000");
  const [monthly, setMonthly] = useState("2000");
  const [monthsTarget, setMonthsTarget] = useState("36");
  const t = useTranslations("comp.savingsGoalCalculator");

  const goalNum = Number(goal) || 0;
  const currentNum = Number(current) || 0;
  const monthlyNum = Number(monthly) || 0;
  const monthsTargetNum = Number(monthsTarget) || 0;

  const remaining = useMemo(() => Math.max(0, goalNum - currentNum), [goalNum, currentNum]);

  const monthsToGoal =
    monthlyNum > 0 ? Math.ceil(remaining / monthlyNum) : null;

  const monthlyRequired =
    monthsTargetNum > 0 ? Math.ceil(remaining / monthsTargetNum) : null;

  function formatMoney(value: number): string {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }

  return (
    <div>
      <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-text">
            {t("goalLabel")}
          </label>
          <input
            id="goal"
            type="number"
            min={0}
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label
            htmlFor="current"
            className="block text-sm font-medium text-text"
          >
            {t("currentLabel")}
          </label>
          <input
            id="current"
            type="number"
            min={0}
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label
            htmlFor="monthly"
            className="block text-sm font-medium text-text"
          >
            {t("monthlyLabel")}
          </label>
          <input
            id="monthly"
            type="number"
            min={0}
            value={monthly}
            onChange={(event) => setMonthly(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label
            htmlFor="months-target"
            className="block text-sm font-medium text-text"
          >
            {t("monthsTargetLabel")}
          </label>
          <input
            id="months-target"
            type="number"
            min={1}
            value={monthsTarget}
            onChange={(event) => setMonthsTarget(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <p className="text-xs text-muted">{t("remaining")}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-text">
            {formatMoney(remaining)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <p className="text-xs text-muted">{t("monthsToGoal")}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-text">
            {monthsToGoal === null ? "—" : monthsToGoal}
          </p>
          {monthsToGoal !== null && (
            <p className="text-xs text-muted">
              ≈ {(monthsToGoal / 12).toFixed(1)} {t("years")}
            </p>
          )}
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3 sm:col-span-2">
          <p className="text-xs text-muted">{t("monthlyRequired")}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-text">
            {monthlyRequired === null
              ? "—"
              : formatMoney(monthlyRequired) + " " + t("perMonth")}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}