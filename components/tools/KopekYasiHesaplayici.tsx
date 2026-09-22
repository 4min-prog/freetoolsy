"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const PER_YEAR = { small: 4, medium: 4.5, large: 5 } as const;

type SizeKey = keyof typeof PER_YEAR;

const SIZES: SizeKey[] = ["small", "medium", "large"];

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

function dogToHuman(age: number, size: SizeKey): number {
  if (age <= 0) return 0;
  if (age <= 1) return age * 15;
  if (age <= 2) return 15 + (age - 1) * 9;
  return 24 + (age - 2) * PER_YEAR[size];
}

export default function KopekYasiHesaplayici() {
  const [dogAge, setDogAge] = useState("");
  const [size, setSize] = useState<SizeKey>("medium");
  const t = useTranslations("comp.kopekYasi");

  const humanAge = useMemo(() => {
    const age = parseNumber(dogAge);
    if (!Number.isFinite(age) || age <= 0 || age > 50) return null;
    return Math.round(dogToHuman(age, size));
  }, [dogAge, size]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kopek-yas" className="block text-sm font-medium text-text">
            {t("dogAgeLabel")}
          </label>
          <input
            id="kopek-yas"
            type="text"
            inputMode="decimal"
            value={dogAge}
            onChange={(event) => setDogAge(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="kopek-boyut" className="block text-sm font-medium text-text">
            {t("sizeLabel")}
          </label>
          <select
            id="kopek-boyut"
            value={size}
            onChange={(event) => setSize(event.target.value as SizeKey)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            {SIZES.map((option) => (
              <option key={option} value={option}>
                {t(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-border bg-bg p-5 text-center">
        <p className="text-2xl font-semibold tabular-nums tracking-tight text-accent">
          {humanAge !== null ? t("humanAge", { age: humanAge }) : "-"}
        </p>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}