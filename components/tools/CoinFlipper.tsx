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
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotation, setRotation] = useState(0);
  const t = useTranslations("comp.coinFlipper");

  const headsLabel = t("heads");
  const tailsLabel = t("tails");
  const headsInitial = headsLabel[0]?.toUpperCase() ?? "H";
  const tailsInitial = tailsLabel[0]?.toUpperCase() ?? "T";

  async function copyLast() {
    const last = history[0];
    if (!last) return;
    try {
      await navigator.clipboard.writeText(last === "heads" ? headsLabel : tailsLabel);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function flip() {
    if (isFlipping) return;
    setIsFlipping(true);

    const result: Side = Math.random() < 0.5 ? "heads" : "tails";
    const spins = 4 + Math.floor(Math.random() * 2);
    const extra = result === "tails" ? 180 : 0;
    const nextRotation = rotation + spins * 360 + extra;

    setRotation(nextRotation);

    setTimeout(() => {
      setHistory((current) => [result, ...current].slice(0, 50));
      setIsFlipping(false);
    }, 800);
  }

  const headsCount = history.filter((side) => side === "heads").length;
  const tailsCount = history.filter((side) => side === "tails").length;
  const last = history[0];

  return (
    <div className="flex flex-col items-center">
      <div className="[perspective:900px]">
        <div
          className="relative h-28 w-28 will-change-transform [transform-style:preserve-3d]"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transition: isFlipping
              ? "transform 800ms cubic-bezier(0.25, 0.1, 0.25, 1)"
              : "none",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-full border-[6px] border-amber-400 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 shadow-[0_10px_30px_-10px_rgba(251,191,36,0.9),inset_0_1px_2px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(146,98,0,0.2)] [backface-visibility:hidden]">
            <div className="absolute inset-[2px] rounded-full border border-amber-500/40" />
            <div className="absolute inset-[5px] rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.5),transparent_55%)]" />
            <span className="relative text-3xl font-black tracking-widest text-amber-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
              {headsInitial}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-full border-[6px] border-amber-500 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.9),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(120,53,15,0.25)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="absolute inset-[2px] rounded-full border border-amber-600/40" />
            <div className="absolute inset-[5px] rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.4),transparent_55%)]" />
            <span className="relative text-3xl font-black tracking-widest text-amber-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]">
              {tailsInitial}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-text">
        {isFlipping ? t("flipping") : last ? (last === "heads" ? headsLabel : tailsLabel) : t("empty")}
      </p>

      <button
        type="button"
        onClick={flip}
        disabled={isFlipping}
        className="mt-6 rounded-lg bg-accent px-8 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isFlipping ? t("flipping") : t("flip")}
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
              <p className="text-lg font-semibold tabular-nums text-text">{headsCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface px-3 py-2">
              <p className="text-xs text-muted">{t("tailsCount")}</p>
              <p className="text-lg font-semibold tabular-nums text-text">{tailsCount}</p>
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
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                  side === "heads"
                    ? "bg-amber-200/80 text-amber-900"
                    : "bg-amber-300/80 text-amber-950"
                }`}
                title={side === "heads" ? headsLabel : tailsLabel}
              >
                {side === "heads" ? headsInitial : tailsInitial}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-4 w-full text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}