"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

export default function IdealWeightCalculator() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [current, setCurrent] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.idealWeightCalculator");
  const locale = useLocale();

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale]
  );

  const result = useMemo(() => {
    const h = parseNumber(height);
    if (!Number.isFinite(h) || h < 100 || h > 250) return null;
    const inches = h / 2.54;
    const devine = (sex === "male" ? 50 : 45.5) + 2.3 * (inches - 60);
    const robinson = sex === "male" ? 52 + 1.9 * (inches - 60) : 49 + 1.7 * (inches - 60);
    const meters = h / 100;
    const minRange = 18.5 * meters * meters;
    const maxRange = 24.9 * meters * meters;
    let status: "below" | "within" | "above" | null = null;
    const weightValue = parseNumber(current);
    if (Number.isFinite(weightValue) && weightValue > 0) {
      status = weightValue < minRange ? "below" : weightValue > maxRange ? "above" : "within";
    }
    return { devine, robinson, minRange, maxRange, status };
  }, [sex, height, current]);

  function handleCopy() {
    if (!result) return;
    const text = `${t("devine")}: ${formatter.format(result.devine)} kg • ${t("robinson")}: ${formatter.format(
      result.robinson
    )} kg • ${t("rangeLabel")}: ${formatter.format(result.minRange)} – ${formatter.format(result.maxRange)} kg`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true); showToast();
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  const statusText = result
    ? result.status === "below"
      ? t("below")
      : result.status === "above"
      ? t("above")
      : result.status === "within"
      ? t("within")
      : null
    : null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ideal-kilo-cinsiyet" className="block text-sm font-medium text-text">
            {t("sexLabel")}
          </label>
          <select
            id="ideal-kilo-cinsiyet"
            value={sex}
            onChange={(event) => setSex(event.target.value as "male" | "female")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="ideal-kilo-boy" className="block text-sm font-medium text-text">
            {t("heightLabel")}
          </label>
          <input
            id="ideal-kilo-boy"
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="e.g. 175"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => { setSex("male"); setHeight("175"); }} />
      </div>

      <label htmlFor="ideal-kilo-guncel" className="mt-5 block text-sm font-medium text-text">
        {t("currentWeightLabel")}
      </label>
      <input
        id="ideal-kilo-guncel"
        type="text"
        inputMode="decimal"
        value={current}
        onChange={(event) => setCurrent(event.target.value)}
        placeholder={t("currentWeightPlaceholder")}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {result ? (
        <div className="mt-5">
          <div className="rounded-lg border border-border bg-bg p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-text">
                {formatter.format(result.devine)} kg
              </span>
              <span className="text-sm font-medium text-accent">{t("devine")}</span>
            </div>
            <p className="mt-2 text-sm tabular-nums text-muted">
              {t("robinson")}: {formatter.format(result.robinson)} kg
            </p>
            <p className="mt-2 text-sm tabular-nums text-muted">
              {t("rangeLabel")}: {formatter.format(result.minRange)} – {formatter.format(result.maxRange)} kg
            </p>
            <p className="mt-2 text-xs leading-relaxed text-faint">{t("note")}</p>
          </div>

          {statusText ? (
            <div
              className={`mt-4 rounded-lg border px-3.5 py-2.5 text-sm ${
                result.status === "within"
                  ? "border-accent bg-surface text-text"
                  : "border-border bg-bg text-muted"
              }`}
            >
              <span className="font-medium">{t("currentState")}</span> {statusText}
            </div>
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
    </div>
  );
}