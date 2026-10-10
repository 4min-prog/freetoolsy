"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

const CPI: Record<number, number> = {
  1970: 38.8, 1971: 40.5, 1972: 41.8, 1973: 44.4, 1974: 49.3, 1975: 53.8,
  1976: 56.9, 1977: 60.6, 1978: 65.2, 1979: 72.6, 1980: 82.4, 1981: 90.9,
  1982: 96.5, 1983: 99.6, 1984: 103.9, 1985: 107.6, 1986: 109.6, 1987: 113.6,
  1988: 118.3, 1989: 124.0, 1990: 130.7, 1991: 136.2, 1992: 140.3, 1993: 144.5,
  1994: 148.2, 1995: 152.4, 1996: 156.9, 1997: 160.5, 1998: 163.0, 1999: 166.6,
  2000: 172.2, 2001: 177.1, 2002: 179.9, 2003: 184.0, 2004: 188.9, 2005: 195.3,
  2006: 201.6, 2007: 207.3, 2008: 215.3, 2009: 214.5, 2010: 218.1, 2011: 224.9,
  2012: 229.6, 2013: 233.0, 2014: 236.7, 2015: 237.0, 2016: 240.0, 2017: 245.1,
  2018: 251.1, 2019: 255.7, 2020: 258.8, 2021: 271.0, 2022: 292.7, 2023: 304.7,
  2024: 313.3, 2025: 322.0,
};

const YEARS = Object.keys(CPI)
  .map(Number)
  .sort((a, b) => a - b);

function money(value: number): string {
  return "$" + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function InflationCalculator() {
  const [amount, setAmount] = useState("1000");
  const [startYear, setStartYear] = useState("2010");
  const [endYear, setEndYear] = useState("2025");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.inflationCalculator");

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function clear() {
    setAmount("");
    setStartYear("2010");
    setEndYear("2025");
    setCopied(false);
  }

  const result = useMemo(() => {
    const parsedAmount = Number(amount.replace(",", ""));
    const start = Number(startYear);
    const end = Number(endYear);
    const startCpi = CPI[start];
    const endCpi = CPI[end];
    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount < 0 ||
      startCpi === undefined ||
      endCpi === undefined
    ) {
      return null;
    }
    return {
      startCpi,
      endCpi,
      adjusted: (parsedAmount * endCpi) / startCpi,
    };
  }, [amount, startYear, endYear]);

  return (
    <div>
      <div className="grid max-w-md gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label htmlFor="infl-amount" className="block text-xs font-medium text-muted">
            {t("amountLabel")}
          </label>
          <input
            id="infl-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="infl-start" className="block text-xs font-medium text-muted">
            {t("startYear")}
          </label>
          <select
            id="infl-start"
            value={startYear}
            onChange={(event) => setStartYear(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="infl-end" className="block text-xs font-medium text-muted">
            {t("endYear")}
          </label>
          <select
            id="infl-end"
            value={endYear}
            onChange={(event) => setEndYear(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("adjustedValue")}</p>
            <p className="mt-1 text-lg font-semibold text-accent">{money(result.adjusted)}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-muted">{t("cpiChange")}</p>
            <p className="mt-1 text-lg font-semibold text-text">
              {result.startCpi} → {result.endCpi}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">{t("invalid")}</p>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => copy(result ? money(result.adjusted) : "")}
          disabled={!result}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={amount === "" && startYear === "2010" && endYear === "2025"}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}