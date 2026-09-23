"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const ACTIVITIES = [
  { value: "sed", factor: 1.2 },
  { value: "light", factor: 1.375 },
  { value: "mod", factor: 1.55 },
  { value: "active", factor: 1.725 },
  { value: "very", factor: 1.9 },
] as const;

type ActivityValue = (typeof ACTIVITIES)[number]["value"];

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-3 text-center">
      <div className="text-xl font-semibold tabular-nums tracking-tight text-text">
        {props.value}
      </div>
      <div className="mt-1 text-xs text-muted">{props.label}</div>
    </div>
  );
}

function GoalRow(props: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border bg-surface px-4 py-3 text-sm first:border-t-0">
      <span className="text-muted">{props.label}</span>
      <span className={`tabular-nums ${props.accent ? "text-lg font-semibold text-text" : "text-text"}`}>
        {props.value}
      </span>
    </div>
  );
}

export default function KaloriBmr() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<ActivityValue>("mod");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.kaloriBmr");
  const locale = useLocale();

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale]
  );

  const result = useMemo(() => {
    const a = parseNumber(age);
    const h = parseNumber(height);
    const w = parseNumber(weight);
    if (!Number.isFinite(a) || !Number.isFinite(h) || !Number.isFinite(w)) return null;
    if (a < 10 || a > 110 || h < 100 || h > 250 || w < 25 || w > 300) return null;
    const base = 10 * w + 6.25 * h - 5 * a;
    const bmr = sex === "male" ? base + 5 : base - 161;
    const activityItem = ACTIVITIES.find((item) => item.value === activity) ?? ACTIVITIES[2];
    const tdee = bmr * activityItem.factor;
    return {
      bmr,
      tdee,
      lose: tdee - 500,
      keep: tdee,
      gain: tdee + 500,
    };
  }, [sex, age, height, weight, activity]);

  function handleCopy() {
    if (!result) return;
    navigator.clipboard
      .writeText(`${formatter.format(result.tdee)} ${t("kcal")}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  const tiles = [
    { key: "bmr", label: t("bmr"), value: result ? `${formatter.format(result.bmr)} ${t("kcal")}` : "-" },
    { key: "tdee", label: t("tdee"), value: result ? `${formatter.format(result.tdee)} ${t("kcal")}` : "-" },
  ];

  const goalRows = result
    ? [
        { key: "loseGoal", label: t("loseGoal"), value: `${formatter.format(result.lose)} ${t("kcal")}`, accent: false },
        { key: "keepGoal", label: t("keepGoal"), value: `${formatter.format(result.keep)} ${t("kcal")}`, accent: true },
        { key: "gainGoal", label: t("gainGoal"), value: `${formatter.format(result.gain)} ${t("kcal")}`, accent: false },
      ]
    : [];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kalori-bmr-cinsiyet" className="block text-sm font-medium text-text">
            {t("sexLabel")}
          </label>
          <select
            id="kalori-bmr-cinsiyet"
            value={sex}
            onChange={(event) => setSex(event.target.value as "male" | "female")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="kalori-bmr-yas" className="block text-sm font-medium text-text">
            {t("ageLabel")}
          </label>
          <input
            id="kalori-bmr-yas"
            type="text"
            inputMode="numeric"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="e.g. 30"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="kalori-bmr-boy" className="block text-sm font-medium text-text">
            {t("heightLabel")}
          </label>
          <input
            id="kalori-bmr-boy"
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="e.g. 175"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="kalori-bmr-kilo" className="block text-sm font-medium text-text">
            {t("weightLabel")}
          </label>
          <input
            id="kalori-bmr-kilo"
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="e.g. 70"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label htmlFor="kalori-bmr-aktivite" className="mt-5 block text-sm font-medium text-text">
        {t("activityLabel")}
      </label>
      <select
        id="kalori-bmr-aktivite"
        value={activity}
        onChange={(event) => setActivity(event.target.value as ActivityValue)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
      >
        <option value="sed">{t("sedentary")}</option>
        <option value="light">{t("light")}</option>
        <option value="mod">{t("moderate")}</option>
        <option value="active">{t("active")}</option>
        <option value="very">{t("veryActive")}</option>
      </select>

      {result ? (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-2">
            {tiles.map((tile) => (
              <Stat key={tile.key} label={tile.label} value={tile.value} />
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            {goalRows.map((row) => (
              <GoalRow key={row.key} label={row.label} value={row.value} accent={row.accent} />
            ))}
          </div>

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

      <p className="mt-4 text-xs leading-relaxed text-faint">{t("note")}</p>
    </div>
  );
}