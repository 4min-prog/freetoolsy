"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

const formatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 2,
});

const MODES = [
  { id: "percent", label: "Sayının yüzdesi" },
  { id: "change", label: "Yüzde değişimi" },
  { id: "part", label: "Bütünün yüzdesi" },
] as const;

type ModeId = (typeof MODES)[number]["id"];

function Input(props: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-text">
        {props.label}
      </label>
      <input
        id={props.id}
        type="text"
        inputMode="decimal"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

export default function YuzdeHesaplayici() {
  const [mode, setMode] = useState<ModeId>("percent");
  const [value, setValue] = useState("");
  const [percent, setPercent] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [part, setPart] = useState("");
  const [whole, setWhole] = useState("");

  const result = useMemo((): { title: string; body: ReactNode } | null => {
    if (mode === "percent") {
      const v = parseNumber(value);
      const p = parseNumber(percent);
      if (!Number.isFinite(v) || !Number.isFinite(p)) return null;
      const calculated = (v * p) / 100;
      return {
        title: "Sonuç",
        body: (
          <>
            {formatter.format(v)} sayısının %{formatter.format(p)}&apos;i:
            <span className="mt-1 block text-2xl font-semibold tabular-nums tracking-tight text-text">
              {formatter.format(calculated)}
            </span>
          </>
        ),
      };
    }

    if (mode === "change") {
      const s = parseNumber(start);
      const e = parseNumber(end);
      if (!Number.isFinite(s) || !Number.isFinite(e)) return null;
      if (s === 0) {
        return {
          title: "Bilgi",
          body: "Başlangıç değeri sıfır olamaz.",
        };
      }
      const change = ((e - s) / Math.abs(s)) * 100;
      return {
        title: "Değişim",
        body: (
          <>
            {formatter.format(s)} değerinden {formatter.format(e)} değerine geçiş:
            <span
              className={`mt-1 block text-2xl font-semibold tabular-nums tracking-tight ${
                change >= 0 ? "text-success" : "text-danger"
              }`}
            >
              %{formatter.format(change)}
            </span>
            <span className="mt-1 block text-sm text-muted">
              {change >= 0 ? "artış" : "azalış"} gösterir.
            </span>
          </>
        ),
      };
    }

    const p = parseNumber(part);
    const w = parseNumber(whole);
    if (!Number.isFinite(p) || !Number.isFinite(w)) return null;
    if (w === 0) {
      return {
        title: "Bilgi",
        body: "Bütün değeri sıfır olamaz.",
      };
    }
    const calculated = (p / w) * 100;
    return {
      title: "Sonuç",
      body: (
        <>
          {formatter.format(p)} değeri, {formatter.format(w)} sayısının
          <span className="mt-1 block text-2xl font-semibold tabular-nums tracking-tight text-text">
            %{formatter.format(calculated)}
          </span>
        </>
      ),
    };
  }, [mode, value, percent, start, end, part, whole]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Hesaplama modu"
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface-2 p-1"
      >
        {MODES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={mode === option.id}
            onClick={() => setMode(option.id)}
            className={`flex-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === option.id
                ? "bg-surface text-text shadow-card"
                : "text-muted hover:text-text"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {mode === "percent" && (
          <>
            <Input id="yuzde-sayi" label="Sayı" value={value} onChange={setValue} placeholder="örn. 100" />
            <Input id="yuzde-oran" label="Yüzde (%)" value={percent} onChange={setPercent} placeholder="örn. 20" />
          </>
        )}
        {mode === "change" && (
          <>
            <Input id="yuzde-baslangic" label="Başlangıç değeri" value={start} onChange={setStart} placeholder="örn. 80" />
            <Input id="yuzde-son" label="Son değer" value={end} onChange={setEnd} placeholder="örn. 100" />
          </>
        )}
        {mode === "part" && (
          <>
            <Input id="yuzde-parca" label="Parça değeri" value={part} onChange={setPart} placeholder="örn. 20" />
            <Input id="yuzde-butun" label="Bütün değer" value={whole} onChange={setWhole} placeholder="örn. 100" />
          </>
        )}
      </div>

      {result ? (
        <div className="mt-5 rounded-lg border border-border bg-bg p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {result.title}
          </p>
          <div className="mt-2 text-sm leading-relaxed text-muted">
            {result.body}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">Değerleri girince sonuç anında görünür.</p>
        </div>
      )}
    </div>
  );
}