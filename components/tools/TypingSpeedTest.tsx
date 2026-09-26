"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const EN_TEXT =
  "The quick brown fox jumps over the lazy dog while the wind blows gently through the tall trees. Practice makes perfect, so keep typing without looking at the keyboard and let your fingers find the keys naturally.";

const TR_TEXT =
  "Hızlı kahverengi tilki tembel köpeğin üzerinden atlarken rüzgar uzun ağaçların arasından hafifçe eser. Pratik ustalaştırır, bu yüzden klavyeye bakmadan yazmaya devam edin ve parmaklarınızın tuşları doğal olarak bulmasına izin verin.";

const DURATIONS = [15, 30, 60] as const;

type Result = { wpm: number; accuracy: number; correct: number; errors: number };

export default function TypingSpeedTest() {
  const [language, setLanguage] = useState<"en" | "tr">("en");
  const [duration, setDuration] = useState<number>(30);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const t = useTranslations("comp.typingSpeedTest");

  const text = language === "en" ? EN_TEXT : TR_TEXT;
  const running = remaining !== null && remaining > 0 && result === null;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function start() {
    if (timerRef.current) clearInterval(timerRef.current);
    setInput("");
    setResult(null);
    setRemaining(duration);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const left = duration - elapsed;
      if (left <= 0) {
        finish();
      } else {
        setRemaining(left);
      }
    }, 200);
  }

  function finish() {
    if (timerRef.current) clearInterval(timerRef.current);
    finishTyping();
  }

  function finishTyping() {
    const typed = input;
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correct++;
      else errors++;
    }
    const minutes = duration / 60;
    const wpm = Math.round((correct / 5) / minutes);
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
    setRemaining(0);
    setResult({ wpm, accuracy, correct, errors });
    setInput("");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          {(["en", "tr"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setLanguage(value);
                setResult(null);
                setInput("");
                setRemaining(null);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                language === value ? "bg-accent text-on-accent" : "text-muted hover:text-foreground"
              }`}
            >
              {t(value)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          {DURATIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setDuration(option);
                setResult(null);
                setInput("");
                setRemaining(null);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                duration === option ? "bg-accent text-on-accent" : "text-muted hover:text-foreground"
              }`}
            >
              {option}s
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={start}
          disabled={running}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {result || !running ? t("start") : t("running")}
        </button>
      </div>

      {running ? (
        <p className="mt-4 font-mono text-sm text-accent">
          {t("timeLeft")}: {remaining}s
        </p>
      ) : null}

      <div className="mt-4 rounded-lg border border-border bg-surface p-4">
        <p className="text-sm leading-relaxed text-text">
          {text.split("").map((char, index) => {
            let className = "text-muted";
            if (index < input.length) {
              className = input[index] === char ? "text-emerald-500" : "bg-danger/20 text-text";
            } else if (index === input.length && running) {
              className = "bg-accent/20 text-text underline";
            }
            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </p>
        <textarea
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            if (event.target.value.length >= text.length) finishTyping();
          }}
          onPaste={(event) => event.preventDefault()}
          disabled={!running}
          placeholder={t("typingPlaceholder")}
          className="mt-4 min-h-24 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
        />
      </div>

      {result ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("wpm")}</p>
            <p className="mt-1 text-xl font-semibold text-accent">{result.wpm}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("accuracy")}</p>
            <p className="mt-1 text-xl font-semibold text-text">%{result.accuracy}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("correct")}</p>
            <p className="mt-1 text-xl font-semibold text-text">{result.correct}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("errors")}</p>
            <p className="mt-1 text-xl font-semibold text-text">{result.errors}</p>
          </div>
        </div>
      ) : !running ? (
        <p className="mt-4 text-sm text-muted">{t("readyHint")}</p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}