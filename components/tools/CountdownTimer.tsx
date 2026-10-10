"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

export default function CountdownTimer() {
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [total, setTotal] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = useTranslations("comp.countdownTimer");

  const running = total !== null && remaining > 0;
  const finished = total !== null && remaining === 0;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function parseTotal(): number | null {
    const h = Math.min(Math.max(Number(hours) || 0, 0), 99);
    const m = Math.min(Math.max(Number(minutes) || 0, 0), 59);
    const s = Math.min(Math.max(Number(seconds) || 0, 0), 59);
    const value = h * 3600 + m * 60 + s;
    return value > 0 ? value : null;
  }

  function start() {
    const value = parseTotal();
    if (value === null) return;
    setTotal(value);
    setRemaining(value);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining((current) => {
        const next = current - 1;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return next;
      });
    }, 1000);
  }

  function pause() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTotal((current) => (current === null ? null : remaining));
  }

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    setTotal(null);
    setRemaining(0);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const display = (() => {
    const value = total === null ? 0 : remaining;
    const h = Math.floor(value / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = value % 60;
    return [h, m, s].map((part) => String(part).padStart(2, "0")).join(":");
  })();

  return (
    <div>
      <div className="grid max-w-md grid-cols-3 gap-4">
        <div>
          <label htmlFor="cd-h" className="block text-xs font-medium text-muted">
            {t("hours")}
          </label>
          <input
            id="cd-h"
            type="number"
            min={0}
            max={99}
            value={hours}
            disabled={running}
            onChange={(event) => setHours(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="cd-m" className="block text-xs font-medium text-muted">
            {t("minutes")}
          </label>
          <input
            id="cd-m"
            type="number"
            min={0}
            max={59}
            value={minutes}
            disabled={running}
            onChange={(event) => setMinutes(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="cd-s" className="block text-xs font-medium text-muted">
            {t("seconds")}
          </label>
          <input
            id="cd-s"
            type="number"
            min={0}
            max={59}
            value={seconds}
            disabled={running}
            onChange={(event) => setSeconds(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center">
        <p className="font-mono text-5xl tabular-nums text-accent sm:text-6xl">{display}</p>
        {finished ? <p className="mt-3 text-sm font-medium text-foreground">{t("timeUp")}</p> : null}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {!running && !finished ? (
          <button
            type="button"
            onClick={start}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("start")}
          </button>
        ) : null}
        {running ? (
          <button
            type="button"
            onClick={pause}
            className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            {t("pause")}
          </button>
        ) : null}
        {finished ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("restart")}
          </button>
        ) : null}
        {running ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            {t("reset")}
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={copy}
          disabled={total === null}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}