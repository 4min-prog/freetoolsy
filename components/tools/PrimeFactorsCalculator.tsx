"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Factor = { prime: number; exponent: number };

function factorize(value: number): Factor[] {
  const factors: Factor[] = [];
  let remaining = value;
  let divisor = 2;
  while (divisor * divisor <= remaining) {
    let exponent = 0;
    while (remaining % divisor === 0) {
      remaining /= divisor;
      exponent += 1;
    }
    if (exponent > 0) factors.push({ prime: divisor, exponent });
    divisor += divisor === 2 ? 1 : 2;
  }
  if (remaining > 1) factors.push({ prime: remaining, exponent: 1 });
  return factors;
}

function notation(factors: Factor[]): string {
  return factors
    .map((factor) => (factor.exponent > 1 ? `${factor.prime}^${factor.exponent}` : String(factor.prime)))
    .join(" × ");
}

export default function PrimeFactorsCalculator() {
  const [input, setInput] = useState("");
  const [stepDivides, setStepDivides] = useState(true);
  const t = useTranslations("comp.primeFactorsCalculator");

  const numeric = Number(input);
  const parsed = /^[0-9]+$/.test(input.trim()) && Number.isInteger(numeric) && numeric >= 1 && numeric <= 100000000;
  const factors = parsed ? factorize(numeric) : [];
  const display = parsed && numeric > 1 ? notation(factors) : parsed && numeric === 1 ? "1" : "";
  const isPrime = parsed && numeric > 1 && factors.length === 1 && factors[0].exponent === 1;

  return (
    <div>
      <div>
        <label htmlFor="pfc-input" className="block text-sm font-medium text-text">
          {t("inputLabel")}
        </label>
        <input
          id="pfc-input"
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. 360"
          className="mt-2 w-full max-w-md rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {input && !parsed ? <p className="mt-3 text-sm text-danger">{t("rangeHint")}</p> : null}

      {display ? (
        <div className="mt-5 rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-muted">{t("resultLabel")}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent">{display}</p>
          {isPrime ? (
            <p className="mt-2 text-sm font-medium text-success">{t("prime")}</p>
          ) : (
            <div className="mt-3">
              <label className="flex items-center gap-2 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={stepDivides}
                  onChange={(event) => setStepDivides(event.target.checked)}
                  className="h-3.5 w-3.5 accent-accent"
                />
                {t("showDivides")}
              </label>
              {stepDivides ? (
                <ul className="mt-2 space-y-1">
                  {factors.map((factor) => (
                    <li key={factor.prime} className="text-sm tabular-nums text-muted">
                      {numeric} ÷ {factor.prime} ={" "}
                      {numeric / Math.pow(factor.prime, factor.exponent)}
                      {factor.exponent > 1 ? ` (${factor.prime}^${factor.exponent})` : ""}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}