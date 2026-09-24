"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

type Frequency = "annually" | "semiannually" | "quarterly" | "monthly" | "daily";

const FREQUENCIES: { id: Frequency; perYear: number }[] = [
  { id: "annually", perYear: 1 },
  { id: "semiannually", perYear: 2 },
  { id: "quarterly", perYear: 4 },
  { id: "monthly", perYear: 12 },
  { id: "daily", perYear: 365 },
];

type GrowthRow = {
  year: number;
  value: number;
  invested: number;
  interest: number;
};

type Result = {
  final: number;
  invested: number;
  interest: number;
  rows: GrowthRow[];
};

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [contribution, setContribution] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [showTable, setShowTable] = useState(false);
  const t = useTranslations("comp.compoundInterest");
  const locale = useLocale();

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }),
    [locale]
  );

  const result = useMemo<Result | null>(() => {
    const p = parseNumber(principal);
    const c = parseNumber(contribution);
    const annual = parseNumber(rate);
    const y = parseNumber(years);
    if (!Number.isFinite(p) || p < 0) return null;
    if (!Number.isFinite(c) || c < 0) return null;
    if (!Number.isFinite(annual) || annual < 0) return null;
    if (!Number.isFinite(y) || y <= 0 || y > 100) return null;

    const perYear = FREQUENCIES.find((f) => f.id === frequency)?.perYear ?? 12;
    const periods = Math.round(y * perYear);
    const r = annual / 100 / perYear;

    let balance = p;
    const rows: GrowthRow[] = [];
    let lastYear = 0;
    let lastBalance = p;
    for (let n = 1; n <= periods; n++) {
      balance = balance * (1 + r) + (r === 0 ? c : c);
      const year = n / perYear;
      if (Math.floor(year) > lastYear || n === periods) {
        lastYear = Math.floor(year);
        lastBalance = balance;
        if (n === periods && Math.floor(periods / perYear) > lastYear) {
          lastYear = Math.floor(periods / perYear);
        }
        rows.push({
          year: lastYear,
          value: balance,
          invested: p + c * n,
          interest: balance - (p + c * n),
        });
      }
    }
    void lastBalance;

    const invested = p + c * periods;
    return { final: balance, invested, interest: balance - invested, rows };
  }, [principal, contribution, rate, years, frequency]);

  const tiles = [
    { key: "finalAmount", label: t("finalAmount"), value: result ? currency.format(result.final) : "-" },
    { key: "totalInvested", label: t("totalInvested"), value: result ? currency.format(result.invested) : "-" },
    { key: "totalInterest", label: t("totalInterest"), value: result ? currency.format(result.interest) : "-" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ci-principal" className="block text-sm font-medium text-text">
            {t("principalLabel")}
          </label>
          <input
            id="ci-principal"
            type="text"
            inputMode="decimal"
            value={principal}
            onChange={(event) => setPrincipal(event.target.value)}
            placeholder={t("principalPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="ci-contribution" className="block text-sm font-medium text-text">
            {t("contributionLabel")}
          </label>
          <input
            id="ci-contribution"
            type="text"
            inputMode="decimal"
            value={contribution}
            onChange={(event) => setContribution(event.target.value)}
            placeholder={t("contributionPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <SampleButton
              onApply={() => {
                setPrincipal("100000");
                setContribution("5000");
                setRate("10");
                setYears("10");
                setFrequency("monthly");
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ci-rate" className="block text-sm font-medium text-text">
            {t("rateLabel")}
          </label>
          <input
            id="ci-rate"
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            placeholder={t("ratePlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="ci-years" className="block text-sm font-medium text-text">
            {t("yearsLabel")}
          </label>
          <input
            id="ci-years"
            type="text"
            inputMode="decimal"
            value={years}
            onChange={(event) => setYears(event.target.value)}
            placeholder={t("yearsPlaceholder")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label htmlFor="ci-frequency" className="mt-5 block text-sm font-medium text-text">
        {t("frequencyLabel")}
      </label>
      <select
        id="ci-frequency"
        value={frequency}
        onChange={(event) => setFrequency(event.target.value as Frequency)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {FREQUENCIES.map((f) => (
          <option key={f.id} value={f.id}>
            {t(`frequency_${f.id}`)}
          </option>
        ))}
      </select>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.key} className="rounded-lg border border-border bg-bg px-3 py-3 text-center">
            <div className="text-xl font-semibold tabular-nums tracking-tight text-text">
              {tile.value}
            </div>
            <div className="mt-1 text-xs text-muted">{tile.label}</div>
          </div>
        ))}
      </div>

      {result && result.rows.length > 0 ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowTable((current) => !current)}
            className="text-sm font-medium text-accent hover:underline"
          >
            {showTable ? t("hideGrowth") : t("showGrowth")}
          </button>
          {showTable ? (
            <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-surface-2 text-xs text-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">{t("yearCol")}</th>
                    <th className="px-3 py-2 font-medium">{t("valueCol")}</th>
                    <th className="px-3 py-2 font-medium">{t("investedCol")}</th>
                    <th className="px-3 py-2 font-medium">{t("interestCol")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.year} className="border-t border-border bg-surface">
                      <td className="px-3 py-1.5 tabular-nums text-muted">{row.year}</td>
                      <td className="px-3 py-1.5 tabular-nums text-text">{currency.format(row.value)}</td>
                      <td className="px-3 py-1.5 tabular-nums text-text">{currency.format(row.invested)}</td>
                      <td className="px-3 py-1.5 tabular-nums text-text">{currency.format(row.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}
    </div>
  );
}