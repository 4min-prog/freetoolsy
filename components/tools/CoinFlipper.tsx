"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

type Side = "heads" | "tails";

function longestStreak(history: Side[]): number {
  let best = 0;
  let current = 0;
  let previous: Side | null = null;
  for (const side of history) {
    current = side === previous ? current + 1 : 1;
    previous = side;
    if (current > best) best = current;
  }
  return best;
}

export default function CoinFlipper() {
  const [history, setHistory] = useState<Side[]>([]);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.coinFlipper");

  async function copyLast() {
    const last = history[0];
    if (!last) return;
    try {
      await navigator.clipboard.writeText(last === "heads" ? t("heads") : t("tails"));
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function flip() {
    const result: Side = Math.random() < 0.5 ? "heads" : "tails";
    setHistory((current) => [result, ...current].slice(0, 50));
  }

  const heads = history.filter((side) => side === "heads").length;
  const tails = history.filter((side) => side === "tails").length;
  const last = history[0];

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-full border-8 text-2xl font-bold ${
          last === "heads"
            ? "border-accent bg-accent/10 text-accent"
            : last === "tails"
              ? "border-muted bg-surface text-muted"
              : "border-border bg-surface text-faint"
        }`}
      >
        {last ? (last === "heads" ? t("heads") : t("tails")) : t("empty")}
      </div>

      <button
        type="button"
        onClick={flip}
        className="mt-6 rounded-lg bg-accent px-8 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("flip")}
      </button>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={copyLast}
          disabled={!history[0]}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={() => {
            setHistory([]);
            setCopied(false);
          }}
          disabled={history.length === 0}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      {history.length > 0 ? (
        <div className="mt-6 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-border bg-surface px-3 py-2">
              <p className="text-xs text-muted">{t("headsCount")}</p>
              <p className="text-lg font-semibold tabular-nums text-text">{heads}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface px-3 py-2">
              <p className="text-xs text-muted">{t("tailsCount")}</p>
              <p className="text-lg font-semibold tabular-nums text-text">{tails}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface px-3 py-2">
              <p className="text-xs text-muted">{t("streak")}</p>
              <p className="text-lg font-semibold tabular-nums text-text">{longestStreak(history)}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {history.slice(1, 21).map((side, index) => (
              <span
                key={index}
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  side === "heads" ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted"
                }`}
              >
                {side === "heads" ? "T" : "Y"}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-4 w-full text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}