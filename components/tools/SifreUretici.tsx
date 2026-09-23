"use client";

import { showToast } from "@/lib/toast";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

type SetKey = keyof typeof SETS;

const OPTIONS: { key: SetKey }[] = [
  { key: "lower" },
  { key: "upper" },
  { key: "digits" },
  { key: "symbols" },
];

const COUNTS = [1, 5];

function randomIndex(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function generate(length: number, active: SetKey[]): string {
  const pool = active.map((key) => SETS[key]).join("");
  if (!pool) return "";

  const chars: string[] = [];
  for (const key of active) {
    const set = SETS[key];
    chars.push(set[randomIndex(set.length)]);
  }
  while (chars.length < length) {
    chars.push(pool[randomIndex(pool.length)]);
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, length).join("");
}

function strengthKey(length: number, enabled: SetKey[]): string | null {
  const poolSize = enabled.reduce((sum, key) => sum + SETS[key].length, 0);
  if (enabled.length === 0 || poolSize === 0) return null;
  const bits = length * Math.log2(poolSize);
  if (bits < 45) return "weak";
  if (bits < 70) return "medium";
  if (bits < 100) return "strong";
  return "veryStrong";
}

export default function SifreUretici() {
  const [length, setLength] = useState(16);
  const [enabled, setEnabled] = useState<SetKey[]>(["lower", "upper", "digits", "symbols"]);
  const [count, setCount] = useState<number>(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const t = useTranslations("comp.sifreUretici");
  const optionLabel = useTranslations("comp.sifreUretici");
  const strengthClass: Record<string, string> = {
    weak: "text-danger",
    medium: "text-warning",
    strong: "text-success",
    veryStrong: "text-success",
  };

  const regenerate = useCallback(() => {
    const next: string[] = [];
    for (let i = 0; i < count; i++) next.push(generate(length, enabled));
    setPasswords(next);
    setCopiedIndex(null);
  }, [length, enabled, count]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const strength = useMemo(() => strengthKey(length, enabled), [length, enabled]);

  async function copyPassword(password: string, index: number) {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedIndex(index); showToast();
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      setCopiedIndex(null);
    }
  }

  function toggleSet(key: SetKey) {
    setEnabled((current) => {
      const next = current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key];
      return next.length === 0 ? current : next;
    });
  }

  const noError = enabled.length > 0 && passwords.length > 0;

  return (
    <div>
      <label htmlFor="sifre-uzunluk" className="flex items-baseline justify-between text-sm font-medium text-text">
        {t("length")}
        <span className="text-sm font-semibold tabular-nums text-accent">{length}</span>
      </label>
      <input
        id="sifre-uzunluk"
        type="range"
        min={8}
        max={64}
        value={length}
        onChange={(event) => setLength(Number(event.target.value))}
        className="mt-3 w-full accent-accent"
      />

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-text">{t("charTypes")}</legend>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <label
              key={option.key}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-muted transition-colors hover:border-strong"
            >
              <input
                type="checkbox"
                checked={enabled.includes(option.key)}
                onChange={() => toggleSet(option.key)}
                className="h-4 w-4 rounded accent-accent"
              />
              {optionLabel(`option${option.key.charAt(0).toUpperCase()}${option.key.slice(1)}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <label
        htmlFor="sifre-adet"
        className="mt-5 block text-sm font-medium text-text"
      >
        {t("genCount")}
      </label>
      <select
        id="sifre-adet"
        value={count}
        onChange={(event) => setCount(Number(event.target.value))}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none sm:w-auto"
      >
        {COUNTS.map((option) => (
          <option key={option} value={option}>
            {option === 1
              ? t("passwordSingular", { count: option })
              : t("passwordMany", { count: option })}
          </option>
        ))}
      </select>

      {count === 1 ? (
        <div className="mt-6 rounded-lg border border-border bg-bg p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 break-all font-mono text-base leading-relaxed text-text sm:text-lg">
              {noError ? passwords[0] : t("selectType")}
            </p>
            <button
              type="button"
              onClick={() => copyPassword(passwords[0], 0)}
              disabled={!noError}
              className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
            >
              {copiedIndex === 0 ? t("copied") : t("copy")}
            </button>
          </div>
          {strength && noError && (
            <p className={`mt-2 text-xs font-medium ${strengthClass[strength]}`}>
              {t("strength", { label: t(strength) })}
            </p>
          )}
        </div>
      ) : (
        <ol className="mt-6 space-y-2">
          {Array.from({ length: count }).map((_, index) => {
            const password = passwords[index] ?? "";
            return (
              <li
                key={index}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-3.5 py-2.5"
              >
                <span className="min-w-0 break-all font-mono text-sm leading-relaxed text-text">
                  {password || "…"}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {strength && noError && (
                    <span className={`text-xs font-medium ${strengthClass[strength]}`}>
                      {t(strength)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => copyPassword(password, index)}
                    disabled={!password}
                    className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
                  >
                    {copiedIndex === index ? t("copied") : t("copy")}
                  </button>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <button
        type="button"
        onClick={regenerate}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {count > 1 ? t("generateMany", { count }) : t("generate")}
      </button>
    </div>
  );
}