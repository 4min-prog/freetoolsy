"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FibonacciGenerator() {
  const [count, setCount] = useState("20");
  const [sequence, setSequence] = useState<number[]>([]);
  const t = useTranslations("comp.fibonacciGenerator");

  function generate() {
    const n = Math.min(Math.max(Math.floor(Number(count)) || 0, 1), 100);
    const values: number[] = [0, 1];
    for (let i = 2; i < n; i++) {
      values.push(values[i - 1] + values[i - 2]);
    }
    setSequence(values.slice(0, n));
  }

  const sum = sequence.reduce((total, value) => total + value, 0);
  const nth = sequence[sequence.length - 1];

  return (
    <div>
      <div className="flex max-w-md items-end gap-3">
        <div className="flex-1">
          <label htmlFor="fib-count" className="block text-sm font-medium text-text">
            {t("countLabel")}
          </label>
          <input
            id="fib-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={!count}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("generate")}
        </button>
      </div>

      {sequence.length > 0 ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-4">
          <div className="flex flex-wrap gap-1.5">
            {sequence.map((value, index) => (
              <span
                key={index}
                className="rounded bg-bg px-2 py-1 text-sm tabular-nums text-text"
              >
                {value}
              </span>
            ))}
          </div>
          <div className="mt-4 space-y-1 text-sm text-muted">
            <p>
              {t("sum")}: <span className="font-medium tabular-nums text-text">{sum}</span>
            </p>
            <p>
              {t("nth")}: <span className="font-medium tabular-nums text-text">{nth}</span>
            </p>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}