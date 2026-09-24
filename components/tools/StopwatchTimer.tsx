"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Mode = "stopwatch" | "timer";

type Lap = { split: number; total: number };

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((ms % 1000) / 10);
  const parts = [
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ];
  return `${parts.join(":")}.${String(hundredths).padStart(2, "0")}`;
}

export default function StopwatchTimer() {
  const [mode, setMode] = useState<Mode>("stopwatch");
  const [running, setRunning] = useState(false);
  const [now, setNow] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const timerInput = useRef<{ minutes: number; seconds: number }>({ minutes: 5, seconds: 0 });
  const [minInput, setMinInput] = useState("5");
  const [secInput, setSecInput] = useState("0");
  const [finished, setFinished] = useState(false);
  const startRef = useRef(0);
  const elapsedRef = useRef(0);
  const lastLapRef = useRef(0);
  const tickRef = useRef<number | null>(null);
  const t = useTranslations("comp.stopwatchTimer");

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const startElapsed = elapsedRef.current;

    function tick() {
      const elapsed = startElapsed + (performance.now() - startRef.current);
      setNow(elapsed);
      if (mode === "timer") {
        const totalInput = timerInput.current.minutes * 60000 + timerInput.current.seconds * 1000;
        const remaining = totalInput - elapsed;
        if (remaining <= 0) {
          setNow(0);
          setRunning(false);
          setFinished(true);
          beep();
          if (tickRef.current !== null) cancelAnimationFrame(tickRef.current);
          return;
        }
      }
      tickRef.current = requestAnimationFrame(tick);
    }
    tickRef.current = requestAnimationFrame(tick);
    return () => {
      if (tickRef.current !== null) cancelAnimationFrame(tickRef.current);
    };
  }, [running, mode]);

  function beep() {
    try {
      const AudioContextClass =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.type = "square";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.4);
    } catch {
      // Audio is optional; ignore failures.
    }
  }

  function start() {
    setFinished(false);
    if (mode === "timer") {
      const minutes = Number(minInput);
      const seconds = Number(secInput);
      if (!Number.isInteger(minutes) || !Number.isInteger(seconds) || minutes < 0 || seconds < 0 || seconds > 59 || (minutes === 0 && seconds === 0)) {
        return;
      }
      timerInput.current = { minutes, seconds };
      elapsedRef.current = 0;
    }
    setRunning(true);
  }

  function pause() {
    if (!running) return;
    const elapsed = elapsedRef.current + (performance.now() - startRef.current);
    elapsedRef.current = elapsed;
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    elapsedRef.current = 0;
    setNow(0);
    setLaps([]);
    lastLapRef.current = 0;
    setFinished(false);
  }

  function lap() {
    if (!running) return;
    const elapsed = elapsedRef.current + (performance.now() - startRef.current);
    const split = elapsed - lastLapRef.current;
    lastLapRef.current = elapsed;
    setLaps((current) => [{ split, total: elapsed }, ...current]);
  }

  useEffect(() => {
    if (mode === "timer") {
      reset();
    } else {
      reset();
    }
  }, [mode]);

  const displayMs = mode === "timer" ? Math.max(timerInput.current.minutes * 60000 + timerInput.current.seconds * 1000 - now, 0) : now;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("stopwatch")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "stopwatch"
              ? "btn-accent text-on-accent"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
          }`}
        >
          {t("tabStopwatch")}
        </button>
        <button
          type="button"
          onClick={() => setMode("timer")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "timer"
              ? "btn-accent text-on-accent"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
          }`}
        >
          {t("tabTimer")}
        </button>
      </div>

      <div className="mt-8 text-center">
        <div className="text-6xl font-semibold tabular-nums tracking-tight text-text">
          {formatTime(displayMs)}
        </div>
        {finished ? (
          <p className="mt-3 rounded-lg bg-accent/10 px-4 py-2 text-center text-sm font-medium text-accent">
            {t("finished")}
          </p>
        ) : null}

        {mode === "timer" && !running ? (
          <div className="mx-auto mt-6 flex max-w-xs items-center gap-3">
            <div className="flex-1">
              <label htmlFor="sw-min" className="block text-xs font-medium text-muted">
                {t("minutes")}
              </label>
              <input
                id="sw-min"
                type="number"
                min={0}
                max={999}
                value={minInput}
                onChange={(event) => setMinInput(event.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <span className="mt-4 text-sm font-medium text-muted">:</span>
            <div className="flex-1">
              <label htmlFor="sw-sec" className="block text-xs font-medium text-muted">
                {t("seconds")}
              </label>
              <input
                id="sw-sec"
                type="number"
                min={0}
                max={59}
                value={secInput}
                onChange={(event) => setSecInput(event.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex justify-center gap-2">
          {!running ? (
            <button
              type="button"
              onClick={start}
              disabled={mode === "timer" ? finished && displayMs === 0 : false}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {running ? t("pause") : finished ? t("restart") : t("start")}
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {t("pause")}
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {t("reset")}
          </button>
          {mode === "stopwatch" ? (
            <button
              type="button"
              onClick={lap}
              disabled={!running}
              className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
            >
              {t("lap")}
            </button>
          ) : null}
        </div>
      </div>

      {mode === "stopwatch" && laps.length > 0 ? (
        <div className="mt-6 max-h-48 overflow-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-surface-2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">{t("lapCol")}</th>
                <th className="px-3 py-2 font-medium">{t("splitCol")}</th>
                <th className="px-3 py-2 font-medium">{t("totalCol")}</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((item, index) => (
                <tr key={`${item.total}-${index}`} className="border-t border-border bg-surface">
                  <td className="px-3 py-1.5 tabular-nums text-muted">#{laps.length - index}</td>
                  <td className="px-3 py-1.5 tabular-nums text-text">{formatTime(item.split)}</td>
                  <td className="px-3 py-1.5 tabular-nums text-text">{formatTime(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}