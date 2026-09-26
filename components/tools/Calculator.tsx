"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function evaluate(lhs: number, op: string, rhs: number): number {
  switch (op) {
    case "+":
      return lhs + rhs;
    case "-":
      return lhs - rhs;
    case "×":
      return lhs * rhs;
    case "÷":
      return rhs === 0 ? NaN : lhs / rhs;
    default:
      return rhs;
  }
}

function format(value: number): string {
  const fixed = Number(value.toPrecision(12));
  return String(fixed);
}

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);
  const t = useTranslations("comp.calculator");

  function resetAll() {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setWaiting(false);
    setError(false);
  }

  function inputDigit(digit: string) {
    if (error) resetAll();
    if (waiting) {
      setDisplay(digit);
      setWaiting(false);
      return;
    }
    setDisplay((current) => (current === "0" ? digit : current + digit));
  }

  function inputDot() {
    if (error) resetAll();
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }
    setDisplay((current) => (current.includes(".") ? current : current + "."));
  }

  function runPending() {
    if (op === null || acc === null) return;
    const result = evaluate(acc, op, parseFloat(display));
    if (Number.isNaN(result)) {
      setError(true);
    } else {
      setDisplay(format(result));
      setAcc(result);
    }
  }

  function setOperator(next: string) {
    if (error) return;
    if (op !== null && acc !== null && !waiting) {
      runPending();
    } else if (!waiting) {
      setAcc(parseFloat(display));
    }
    setOp(next);
    setWaiting(true);
  }

  function equals() {
    if (error || op === null || acc === null) return;
    runPending();
    setAcc(null);
    setOp(null);
    setWaiting(true);
  }

  function backspace() {
    if (error || waiting) return;
    setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
  }

  function percent() {
    if (error) return;
    setDisplay(format(parseFloat(display) / 100));
  }

  function squareRoot() {
    if (error) return;
    const value = Math.sqrt(parseFloat(display));
    if (Number.isNaN(value)) setError(true);
    else setDisplay(format(value));
  }

  const digitClass =
    "rounded-lg border border-border bg-surface px-3 py-3 text-base font-medium text-text transition-colors hover:border-strong";
  const opClass =
    "rounded-lg bg-accent/10 px-3 py-3 text-base font-medium text-accent transition-colors hover:bg-accent/20";
  const eqClass =
    "rounded-lg bg-accent px-3 py-3 text-base font-bold text-on-accent transition-opacity hover:opacity-90";

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-border bg-bg px-4 py-3 text-right">
        <div
          className={`text-2xl font-semibold tabular-nums tracking-tight ${
            error ? "text-danger" : "text-text"
          }`}
        >
          {error ? t("error") : display}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <button type="button" onClick={resetAll} className={opClass}>
          {t("clear")}
        </button>
        <button type="button" onClick={backspace} className={opClass}>
          {t("backspace")}
        </button>
        <button type="button" onClick={percent} className={opClass}>
          %
        </button>
        <button type="button" onClick={squareRoot} className={opClass}>
          √
        </button>

        {["7", "8", "9"].map((digit) => (
          <button key={digit} type="button" onClick={() => inputDigit(digit)} className={digitClass}>
            {digit}
          </button>
        ))}
        <button type="button" onClick={() => setOperator("÷")} className={opClass}>
          ÷
        </button>

        {["4", "5", "6"].map((digit) => (
          <button key={digit} type="button" onClick={() => inputDigit(digit)} className={digitClass}>
            {digit}
          </button>
        ))}
        <button type="button" onClick={() => setOperator("×")} className={opClass}>
          ×
        </button>

        {["1", "2", "3"].map((digit) => (
          <button key={digit} type="button" onClick={() => inputDigit(digit)} className={digitClass}>
            {digit}
          </button>
        ))}
        <button type="button" onClick={() => setOperator("-")} className={opClass}>
          −
        </button>

        <button type="button" onClick={inputDot} className={digitClass}>
          .
        </button>
        <button type="button" onClick={() => inputDigit("0")} className={digitClass}>
          0
        </button>
        <button type="button" onClick={equals} className={eqClass}>
          =
        </button>
        <button type="button" onClick={() => setOperator("+")} className={opClass}>
          +
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}