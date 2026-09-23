"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const BASES = [
  { id: "bin", radix: 2 },
  { id: "oct", radix: 8 },
  { id: "dec", radix: 10 },
  { id: "hex", radix: 16 },
] as const;

type BaseId = (typeof BASES)[number]["id"];

export default function SayiDonusturucu() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState<BaseId>("dec");
  const [copied, setCopied] = useState<BaseId | null>(null);
  const t = useTranslations("comp.sayi");

  const selected = BASES.find((option) => option.id === base)!;

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    const value = parseBigInt(trimmed, selected.radix);
    if (value === null) return { invalid: true };
    return {
      bin: value.toString(2),
      oct: value.toString(8),
      dec: value.toString(10),
      hex: value.toString(16).toUpperCase(),
    };
  }, [input, selected.radix]);

  function copyText(text: string, id: BaseId) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(id);
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sayi-deger" className="block text-sm font-medium text-text">
            {t("valueLabel")}
          </label>
          <input
            id="sayi-deger"
            type="text"
            inputMode="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("valuePlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <SampleButton onApply={() => setInput(SAMPLES["sayi-donusturucu"])} />
          </div>
        </div>
        <div>
          <label htmlFor="sayi-taban" className="block text-sm font-medium text-text">
            {t("baseLabel")}
          </label>
          <select
            id="sayi-taban"
            value={base}
            onChange={(event) => setBase(event.target.value as BaseId)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-auto"
          >
            {BASES.map((option) => (
              <option key={option.id} value={option.id}>
                {t(option.id)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result === null ? (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("note")}</p>
        </div>
      ) : "invalid" in result ? (
        <div className="mt-5 rounded-lg border border-danger/30 bg-danger/5 px-5 py-6 text-center">
          <p className="text-sm text-danger">
            {t("invalid", { value: input.trim(), base: t(base) })}
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-lg border border-border bg-bg">
          {BASES.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {t(option.id)}
                </p>
                <p className="mt-0.5 break-all font-mono text-sm text-text sm:text-base">
                  {result[option.id]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyText(result[option.id], option.id)}
                className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
              >
                {copied === option.id ? t("copied") : t("copy")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function parseBigInt(value: string, radix: number): bigint | null {
  let result = BigInt(0);
  for (let i = 0; i < value.length; i++) {
    const digit = parseInt(value[i].toLowerCase(), 36);
    if (Number.isNaN(digit) || digit >= radix) return null;
    result = result * BigInt(radix) + BigInt(digit);
  }
  return result;
}