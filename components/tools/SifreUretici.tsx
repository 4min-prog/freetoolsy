"use client";

import { useCallback, useEffect, useState } from "react";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

type SetKey = keyof typeof SETS;

const OPTIONS: { key: SetKey; label: string }[] = [
  { key: "lower", label: "Küçük harf (a–z)" },
  { key: "upper", label: "Büyük harf (A–Z)" },
  { key: "digits", label: "Rakam (0–9)" },
  { key: "symbols", label: "Sembol (!@#…)" },
];

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

export default function SifreUretici() {
  const [length, setLength] = useState(16);
  const [enabled, setEnabled] = useState<SetKey[]>(["lower", "upper", "digits", "symbols"]);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    setPassword(generate(length, enabled));
    setCopied(false);
  }, [length, enabled]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const strength = (() => {
    const poolSize = enabled.reduce((sum, key) => sum + SETS[key].length, 0);
    if (enabled.length === 0 || poolSize === 0) return null;
    const bits = length * Math.log2(poolSize);
    if (bits < 45) return { label: "Zayıf", className: "text-danger" };
    if (bits < 70) return { label: "Orta", className: "text-warning" };
    if (bits < 100) return { label: "Güçlü", className: "text-success" };
    return { label: "Çok güçlü", className: "text-success" };
  })();

  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
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

  return (
    <div>
      <label htmlFor="sifre-uzunluk" className="flex items-baseline justify-between text-sm font-medium text-text">
        Uzunluk
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
        <legend className="text-sm font-medium text-text">Karakter türleri</legend>
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
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 rounded-lg border border-border bg-bg p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 break-all font-mono text-base leading-relaxed text-text sm:text-lg">
            {password || "En az bir karakter türü seçin"}
          </p>
          <button
            type="button"
            onClick={copy}
            disabled={!password}
            className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
          >
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
        {strength && (
          <p className={`mt-2 text-xs font-medium ${strength.className}`}>
            Güç: {strength.label}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={regenerate}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        Yeni şifre üret
      </button>
    </div>
  );
}
