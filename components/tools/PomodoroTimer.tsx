"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

type Phase = "work" | "break";

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
    return;
  }
}

function parseMinutes(value: string, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 120) return fallback;
  return parsed;
}

function formatMs(ms: number): string {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>("work");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [copied, setCopied] = useState(false);
  const [workInput, setWorkInput] = useState("25");
  const [breakInput, setBreakInput] = useState("5");
  const startRef = useRef(0);
  const elapsedRef = useRef(0);
  const phaseRef = useRef<Phase>("work");
  const totalRef = useRef(25 * 60 * 1000);
  const tickRef = useRef<number | null>(null);
  const t = useTranslations("comp.pomodoroTimer");

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();

    function pump() {
      const progress = elapsedRef.current + (performance.now() - startRef.current);
      const remaining = totalRef.current - progress;
      if (remaining <= 0) {
        beep();
        if (phaseRef.current === "work") {
          setSessions((count) => count + 1);
          phaseRef.current = "break";
          totalRef.current = parseMinutes(breakInput, 5) * 60 * 1000;
          setPhase("break");
        } else {
          phaseRef.current = "work";
          totalRef.current = parseMinutes(workInput, 25) * 60 * 1000;
          setPhase("work");
        }
        elapsedRef.current = 0;
        startRef.current = performance.now();
        setElapsed(0);
      } else {
        setElapsed(progress);
      }
      tickRef.current = requestAnimationFrame(pump);
    }

    tickRef.current = requestAnimationFrame(pump);
    return () => {
      if (tickRef.current !== null) cancelAnimationFrame(tickRef.current);
    };
  }, [running]);

  function start() {
    if (elapsedRef.current === 0) {
      totalRef.current =
        (phaseRef.current === "work"
          ? parseMinutes(workInput, 25)
          : parseMinutes(breakInput, 5)) * 60 * 1000;
    }
    startRef.current = performance.now();
    setRunning(true);
  }

  function pause() {
    if (!running) return;
    elapsedRef.current += performance.now() - startRef.current;
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    elapsedRef.current = 0;
    startRef.current = 0;
    setElapsed(0);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(formatMs(remaining));
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const remaining = Math.max(totalRef.current - elapsed, 0);

  return (
    <div>
      <div className="text-center">
        <p className="text-sm font-medium text-muted">{t("phase")}: {phase === "work" ? t("workPhase") : t("breakPhase")}</p>
        <div className="mt-3 text-6xl font-semibold tabular-nums tracking-tight text-text">
          {formatMs(remaining)}
        </div>
        <p className="mt-3 text-sm text-muted">
          {t("sessionsDone")}: {sessions}
        </p>
      </div>

      <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
        <div>
          <label htmlFor="pomo-work" className="block text-xs font-medium text-muted">
            {t("workMinutes")}
          </label>
          <input
            id="pomo-work"
            type="number"
            min={1}
            max={120}
            value={workInput}
            onChange={(event) => setWorkInput(event.target.value)}
            disabled={running}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="pomo-break" className="block text-xs font-medium text-muted">
            {t("breakMinutes")}
          </label>
          <input
            id="pomo-break"
            type="number"
            min={1}
            max={120}
            value={breakInput}
            onChange={(event) => setBreakInput(event.target.value)}
            disabled={running}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {!running ? (
          <button
            type="button"
            onClick={start}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {elapsedRef.current > 0 ? t("resume") : t("start")}
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
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}