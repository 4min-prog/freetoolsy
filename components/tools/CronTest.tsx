"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type FieldKey = "minute" | "hour" | "dom" | "month" | "dow";

type Atom =
  | { kind: "all" }
  | { kind: "step"; step: number }
  | { kind: "single"; value: number }
  | { kind: "range"; from: number; to: number; step: number | null };

type Parsed = { ok: true; atoms: Atom[] } | { ok: false };

const LIMITS: Record<FieldKey, [number, number]> = {
  minute: [0, 59],
  hour: [0, 23],
  dom: [1, 31],
  month: [1, 12],
  dow: [0, 7],
};

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const DOW_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function parseToken(token: string, field: FieldKey): number | null {
  const value = token.trim();
  if (!value) return null;
  if (/^\d+$/.test(value)) {
    const num = Number(value);
    const min = LIMITS[field][0];
    const max = LIMITS[field][1];
    if (num < min || num > max) return null;
    return num;
  }
  if (/^[A-Za-z]{3}$/.test(value)) {
    const code = value.toUpperCase();
    if (field === "month") {
      const index = MONTH_NAMES.indexOf(code);
      return index === -1 ? null : index + 1;
    }
    if (field === "dow") {
      const index = DOW_NAMES.indexOf(code);
      return index === -1 ? null : index;
    }
  }
  return null;
}

function parseAtom(raw: string, field: FieldKey): Atom | null {
  const part = raw.trim();
  if (!part) return null;
  if (part === "*") return { kind: "all" };
  if (part.charAt(0) === "*") {
    const match = /^\*\/(\d+)$/.exec(part);
    if (!match) return null;
    const step = Number(match[1]);
    if (step < 1) return null;
    return { kind: "step", step };
  }
  let body = part;
  let step: number | null = null;
  const slash = part.indexOf("/");
  if (slash !== -1) {
    body = part.slice(0, slash);
    const stepText = part.slice(slash + 1);
    if (!/^\d+$/.test(stepText)) return null;
    step = Number(stepText);
    if (step < 1) return null;
  }
  const dash = body.indexOf("-");
  if (dash === -1) {
    if (step !== null) return null;
    const value = parseToken(body, field);
    if (value === null) return null;
    return { kind: "single", value };
  }
  const from = parseToken(body.slice(0, dash), field);
  const to = parseToken(body.slice(dash + 1), field);
  if (from === null || to === null || from > to) return null;
  return { kind: "range", from, to, step };
}

function parseField(raw: string, field: FieldKey): Parsed {
  const parts = raw.split(",");
  const atoms: Atom[] = [];
  for (let i = 0; i < parts.length; i++) {
    const atom = parseAtom(parts[i], field);
    if (atom === null) return { ok: false };
    atoms.push(atom);
  }
  if (atoms.length === 0) return { ok: false };
  return { ok: true, atoms };
}

function atomCovers(atom: Atom, value: number, min: number, max: number): boolean {
  switch (atom.kind) {
    case "all":
      return value >= min && value <= max;
    case "step":
      return value >= min && value <= max && (value - min) % atom.step === 0;
    case "single":
      return value === atom.value;
    case "range": {
      const step = atom.step ?? 1;
      return value >= atom.from && value <= atom.to && (value - atom.from) % step === 0;
    }
  }
}

function fieldMatches(field: FieldKey, atoms: Atom[], value: number): boolean {
  const min = LIMITS[field][0];
  const max = LIMITS[field][1];
  if (value < min || value > max) return false;
  if (field === "dow") {
    for (let i = 0; i < atoms.length; i++) {
      if (atomCovers(atoms[i], value, min, max)) return true;
      if (atomCovers(atoms[i], value + 7, min, max)) return true;
    }
    return false;
  }
  for (let i = 0; i < atoms.length; i++) {
    if (atomCovers(atoms[i], value, min, max)) return true;
  }
  return false;
}

function pad2(value: number): string {
  return value < 10 ? "0" + value : String(value);
}

function formatIso(date: Date): string {
  return (
    date.getFullYear() +
    "-" +
    pad2(date.getMonth() + 1) +
    "-" +
    pad2(date.getDate()) +
    " " +
    pad2(date.getHours()) +
    ":" +
    pad2(date.getMinutes())
  );
}

type Occurrence = { iso: string; local: string };

export default function CronTest() {
  const t = useTranslations("comp.cronTest");

  const [expr, setExpr] = useState<Record<FieldKey, string>>({
    minute: "*",
    hour: "*",
    dom: "*",
    month: "*",
    dow: "*",
  });
  const [results, setResults] = useState<Occurrence[]>([]);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const labels: Record<FieldKey, string> = {
    minute: t("minuteLabel"),
    hour: t("hourLabel"),
    dom: t("domLabel"),
    month: t("monthLabel"),
    dow: t("dowLabel"),
  };

  const monthLabels = [
    t("jan"), t("feb"), t("mar"), t("apr"), t("may"), t("jun"),
    t("jul"), t("aug"), t("sep"), t("oct"), t("nov"), t("dec"),
  ];

  const dowLabels = [t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")];

  const parsed = useMemo(
    () => ({
      minute: parseField(expr.minute, "minute"),
      hour: parseField(expr.hour, "hour"),
      dom: parseField(expr.dom, "dom"),
      month: parseField(expr.month, "month"),
      dow: parseField(expr.dow, "dow"),
    }),
    [expr]
  );

  const allValid =
    parsed.minute.ok &&
    parsed.hour.ok &&
    parsed.dom.ok &&
    parsed.month.ok &&
    parsed.dow.ok;

  function formatValue(field: FieldKey, value: number): string {
    if (field === "hour") return value + ":00";
    if (field === "month") return monthLabels[value - 1] ?? String(value);
    if (field === "dow") return dowLabels[value === 7 ? 0 : value] ?? String(value);
    return String(value);
  }

  function describeAtom(field: FieldKey, atom: Atom): string {
    switch (atom.kind) {
      case "all":
        if (field === "minute") return t("descMinuteAll");
        if (field === "hour") return t("descHourAll");
        if (field === "dom") return t("descDomAll");
        if (field === "month") return t("descMonthAll");
        return t("descDowAll");
      case "step":
        if (field === "minute") return t("stepMinute", { step: atom.step });
        if (field === "hour") return t("stepHour", { step: atom.step });
        if (field === "dom") return t("stepDom", { step: atom.step });
        if (field === "month") return t("stepMonth", { step: atom.step });
        return t("stepDow", { step: atom.step });
      case "single":
        return formatValue(field, atom.value);
      case "range": {
        const from = formatValue(field, atom.from);
        const to = formatValue(field, atom.to);
        if (atom.step !== null) {
          if (field === "minute") return t("rangeStepMinute", { step: atom.step, from, to });
          if (field === "hour") return t("rangeStepHour", { step: atom.step, from, to });
          if (field === "dom") return t("rangeStepDom", { step: atom.step, from, to });
          if (field === "month") return t("rangeStepMonth", { step: atom.step, from, to });
          return t("rangeStepDow", { step: atom.step, from, to });
        }
        return from + " — " + to;
      }
    }
  }

  function describe(field: FieldKey): string {
    const current = parsed[field];
    if (!current.ok) return "";
    const pieces: string[] = [];
    for (let i = 0; i < current.atoms.length; i++) {
      pieces.push(describeAtom(field, current.atoms[i]));
    }
    return pieces.join(", ");
  }

  function run() {
    if (
      !parsed.minute.ok ||
      !parsed.hour.ok ||
      !parsed.dom.ok ||
      !parsed.month.ok ||
      !parsed.dow.ok
    ) {
      setResults([]);
      setSearched(false);
      return;
    }

    const now = new Date();
    const cursor = new Date(now.getTime());
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    const maxMinutes = 366 * 24 * 60;
    const found: Occurrence[] = [];

    for (let i = 0; i < maxMinutes && found.length < 5; i++) {
      const monthOk = fieldMatches("month", parsed.month.atoms, cursor.getMonth() + 1);
      const hourOk = fieldMatches("hour", parsed.hour.atoms, cursor.getHours());
      const minuteOk = fieldMatches("minute", parsed.minute.atoms, cursor.getMinutes());
      const domOk = fieldMatches("dom", parsed.dom.atoms, cursor.getDate());
      const dowOk = fieldMatches("dow", parsed.dow.atoms, cursor.getDay());
      const domRestricted = expr.dom.trim() !== "*";
      const dowRestricted = expr.dow.trim() !== "*";
      let dayOk = true;
      if (domRestricted && dowRestricted) dayOk = domOk || dowOk;
      else if (domRestricted) dayOk = domOk;
      else if (dowRestricted) dayOk = dowOk;

      if (monthOk && hourOk && minuteOk && dayOk) {
        found.push({
          iso: formatIso(cursor),
          local: cursor.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
        });
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }

    setResults(found);
    setSearched(true);
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(results.map((item) => item.iso).join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const fieldKeys: FieldKey[] = ["minute", "hour", "dom", "month", "dow"];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fieldKeys.map((field) => {
          const current = parsed[field];
          return (
            <div key={field}>
              <label
                htmlFor={"cron-" + field}
                className="block text-sm font-medium text-text"
              >
                {labels[field]}
              </label>
              <input
                id={"cron-" + field}
                type="text"
                value={expr[field]}
                onChange={(event) =>
                  setExpr((currentValue) => ({
                    ...currentValue,
                    [field]: event.target.value,
                  }))
                }
                spellCheck={false}
                placeholder={t("placeholder")}
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <p
                aria-live="polite"
                className={`mt-1.5 min-h-5 text-xs leading-5 ${
                  current.ok ? "text-muted" : "text-faint"
                }`}
              >
                {current.ok ? describe(field) : t("invalid")}
              </p>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={run}
        disabled={!allValid}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {t("run")}
      </button>

      <div
        aria-live="polite"
        className="mt-5 flex items-center justify-between gap-2"
      >
        <p className="text-sm font-medium text-text">{t("resultsLabel")}</p>
        <button
          type="button"
          onClick={copy}
          disabled={results.length === 0}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>

      {searched && results.length === 0 ? (
        <p className="mt-2 rounded-lg border border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text">
          {t("noMatch")}
        </p>
      ) : results.length > 0 ? (
        <div className="mt-2 overflow-hidden rounded-lg border border-border">
          {results.map((item, index) => (
            <div
              key={item.iso + index}
              className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface px-4 py-2.5 first:border-t-0"
            >
              <span className="font-mono text-sm text-text tabular-nums">{item.iso}</span>
              <span className="text-xs text-muted">{item.local}</span>
            </div>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}