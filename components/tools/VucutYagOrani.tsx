"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const MALE_CATEGORIES = [
  { key: "essential", min: 2, max: 5 },
  { key: "athletes", min: 6, max: 13 },
  { key: "fitness", min: 14, max: 17 },
  { key: "average", min: 18, max: 24 },
  { key: "obese", min: 25, max: Infinity },
];

const FEMALE_CATEGORIES = [
  { key: "essential", min: 10, max: 13 },
  { key: "athletes", min: 14, max: 20 },
  { key: "fitness", min: 21, max: 24 },
  { key: "average", min: 25, max: 31 },
  { key: "obese", min: 32, max: Infinity },
];

type Category = (typeof MALE_CATEGORIES)[number];

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

function findCategory(value: number, female: boolean): Category {
  const table = female ? FEMALE_CATEGORIES : MALE_CATEGORIES;
  const clamped = Math.max(0, value);
  for (const item of table) {
    if (clamped <= item.max) return item;
  }
  return table[table.length - 1];
}

export default function VucutYagOrani() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [weight, setWeight] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.vucutYagOrani");
  const locale = useLocale();

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale]
  );

  const result = useMemo(() => {
    const h = parseNumber(height);
    const n = parseNumber(neck);
    const w = parseNumber(waist);
    if (!Number.isFinite(h) || !Number.isFinite(n) || !Number.isFinite(w)) return null;
    if (h <= 0 || n <= 0 || w <= 0) return null;
    if (sex === "female") {
      const hipValue = parseNumber(hip);
      if (!Number.isFinite(hipValue) || hipValue <= 0) return null;
    }
    let fat: number;
    if (sex === "male") {
      const diff = Math.max(w - n, 1);
      fat = 86.01 * Math.log10(diff) - 70.041 * Math.log10(h) + 36.76;
    } else {
      const diff = Math.max(w + parseNumber(hip) - n, 1);
      fat = 163.205 * Math.log10(diff) - 97.684 * Math.log10(h) - 78.387;
    }
    const clamped = Math.max(0, fat);
    const category = findCategory(clamped, sex === "female");
    let fatMass: number | null = null;
    const weightValue = parseNumber(weight);
    if (Number.isFinite(weightValue) && weightValue > 0) {
      fatMass = (clamped / 100) * weightValue;
    }
    return { fat: clamped, category, fatMass };
  }, [sex, height, neck, waist, hip, weight]);

  function handleCopy() {
    if (!result) return;
    const massPart = result.fatMass !== null
      ? ` • ${t("fatMass")}: ${formatter.format(result.fatMass)} kg`
      : "";
    const text = `${t("fatPercent")}: ${formatter.format(result.fat)}% • ${t("categoryLabel")}: ${t(
      result.category.key
    )}${massPart}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true); showToast();
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="vucut-yag-cinsiyet" className="block text-sm font-medium text-text">
            {t("sexLabel")}
          </label>
          <select
            id="vucut-yag-cinsiyet"
            value={sex}
            onChange={(event) => setSex(event.target.value as "male" | "female")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="vucut-yag-boy" className="block text-sm font-medium text-text">
            {t("heightLabel")}
          </label>
          <input
            id="vucut-yag-boy"
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="e.g. 175"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="vucut-yag-boyun" className="block text-sm font-medium text-text">
            {t("neckLabel")}
          </label>
          <input
            id="vucut-yag-boyun"
            type="text"
            inputMode="decimal"
            value={neck}
            onChange={(event) => setNeck(event.target.value)}
            placeholder="e.g. 38"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="vucut-yag-bel" className="block text-sm font-medium text-text">
            {t("waistLabel")}
          </label>
          <input
            id="vucut-yag-bel"
            type="text"
            inputMode="decimal"
            value={waist}
            onChange={(event) => setWaist(event.target.value)}
            placeholder="e.g. 82"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        {sex === "female" ? (
          <div>
            <label htmlFor="vucut-yag-kalca" className="block text-sm font-medium text-text">
              {t("hipLabel")}
            </label>
            <input
              id="vucut-yag-kalca"
              type="text"
              inputMode="decimal"
              value={hip}
              onChange={(event) => setHip(event.target.value)}
              placeholder="e.g. 95"
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        ) : null}
        <div>
          <label htmlFor="vucut-yag-kilo" className="block text-sm font-medium text-text">
            {t("weightLabel")}
          </label>
          <input
            id="vucut-yag-kilo"
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder={t("weightPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => { setHeight("175"); setNeck("38"); setWaist("90"); setWeight("70"); }} />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>

      {result ? (
        <div className="mt-5 rounded-lg border border-border bg-bg p-5">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold tabular-nums tracking-tight text-text">
              {formatter.format(result.fat)}%
            </span>
            <span className="text-sm font-medium text-accent">{t(result.category.key)}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {t(`${result.category.key}Note`)}
          </p>
          {result.fatMass !== null ? (
            <p className="mt-2 text-sm tabular-nums text-muted">
              {t("fatMass")}: {formatter.format(result.fatMass)} kg
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            className="mt-4 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium text-text">{t("scaleLabel")}</p>
        <table className="mt-2 w-full overflow-hidden rounded-lg border border-border text-left text-sm">
          <thead>
            <tr className="bg-surface-2 text-xs text-muted">
              <th className="px-3 py-2 font-medium">{t("scaleCategory")}</th>
              <th className="px-3 py-2 font-medium">{t("male")} (%)</th>
              <th className="px-3 py-2 font-medium">{t("female")} (%)</th>
            </tr>
          </thead>
          <tbody>
            {(sex === "male" ? MALE_CATEGORIES : FEMALE_CATEGORIES).map((category) => {
              const femaleItem = FEMALE_CATEGORIES.find((item) => item.key === category.key);
              return (
                <tr key={category.key} className="border-t border-border bg-surface">
                  <td className="px-3 py-2 text-text">{t(category.key)}</td>
                  <td className="px-3 py-2 tabular-nums text-muted">
                    {category.max === Infinity
                      ? `≥ ${category.min}`
                      : `${category.min} – ${category.max}`}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-muted">
                    {femaleItem && femaleItem.max === Infinity
                      ? `≥ ${femaleItem.min}`
                      : femaleItem
                      ? `${femaleItem.min} – ${femaleItem.max}`
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-xs leading-relaxed text-faint">{t("scaleNote")}</p>
      </div>
    </div>
  );
}