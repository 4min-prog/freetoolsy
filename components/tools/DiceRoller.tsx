"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Roll = { values: number[]; total: number; id: number };

export default function DiceRoller() {
  const [count, setCount] = useState("2");
  const [sides, setSides] = useState("6");
  const [history, setHistory] = useState<Roll[]>([]);
  const t = useTranslations("comp.diceRoller");

  function roll() {
    const dice = Math.min(Math.max(Number(count) || 1, 1), 12);
    const faces = Math.min(Math.max(Number(sides) || 6, 2), 100);
    const values: number[] = [];
    for (let i = 0; i < dice; i++) {
      values.push(Math.floor(Math.random() * faces) + 1);
    }
    const total = values.reduce((sum, value) => sum + value, 0);
    setHistory((current) => [{ values, total, id: Date.now() }, ...current].slice(0, 20));
  }

  return (
    <div>
      <div className="grid max-w-md grid-cols-2 gap-4">
        <div>
          <label htmlFor="dice-count" className="block text-xs font-medium text-muted">
            {t("diceCount")}
          </label>
          <input
            id="dice-count"
            type="number"
            min={1}
            max={12}
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="dice-sides" className="block text-xs font-medium text-muted">
            {t("sides")}
          </label>
          <input
            id="dice-sides"
            type="number"
            min={2}
            max={100}
            value={sides}
            onChange={(event) => setSides(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={roll}
          className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("roll")}
        </button>
      </div>

      {history.length > 0 ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {history[0].values.map((value, index) => (
              <div
                key={`${history[0].id}-${index}`}
                className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-surface text-2xl font-semibold text-accent"
              >
                {value}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            {t("total")}: <span className="font-semibold text-text">{history[0].total}</span>
          </p>
        </div>
      ) : null}

      {history.length > 1 ? (
        <div className="mt-6 max-h-40 overflow-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-surface-2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">{t("rollCol")}</th>
                <th className="px-3 py-2 font-medium">{t("resultCol")}</th>
                <th className="px-3 py-2 font-medium">{t("totalCol")}</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(1).map((roll, index) => (
                <tr key={roll.id} className="border-t border-border bg-surface">
                  <td className="px-3 py-1.5 tabular-nums text-muted">#{history.length - index - 1}</td>
                  <td className="px-3 py-1.5 tabular-nums text-text">{roll.values.join(" · ")}</td>
                  <td className="px-3 py-1.5 tabular-nums text-text">{roll.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}