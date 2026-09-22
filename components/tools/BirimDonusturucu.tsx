"use client";

import { useMemo, useState } from "react";

type Unit = {
  id: string;
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

type Category = {
  id: string;
  label: string;
  units: Unit[];
};

function scaled(id: string, label: string, factor: number): Unit {
  return {
    id,
    label,
    toBase: (value) => value * factor,
    fromBase: (value) => value / factor,
  };
}

const CATEGORIES: Category[] = [
  {
    id: "uzunluk",
    label: "Uzunluk",
    units: [
      scaled("mm", "Milimetre (mm)", 0.001),
      scaled("cm", "Santimetre (cm)", 0.01),
      scaled("m", "Metre (m)", 1),
      scaled("km", "Kilometre (km)", 1000),
      scaled("in", "İnç (in)", 0.0254),
      scaled("ft", "Fit (ft)", 0.3048),
      scaled("yd", "Yarda (yd)", 0.9144),
      scaled("mi", "Mil (mi)", 1609.344),
    ],
  },
  {
    id: "agirlik",
    label: "Ağırlık",
    units: [
      scaled("mg", "Miligram (mg)", 0.000001),
      scaled("g", "Gram (g)", 0.001),
      scaled("kg", "Kilogram (kg)", 1),
      scaled("t", "Ton (t)", 1000),
      scaled("oz", "Ons (oz)", 0.0283495),
      scaled("lb", "Pound (lb)", 0.453592),
    ],
  },
  {
    id: "hacim",
    label: "Hacim",
    units: [
      scaled("ml", "Mililitre (ml)", 0.001),
      scaled("cl", "Santilitre (cl)", 0.01),
      scaled("dl", "Desilitre (dl)", 0.1),
      scaled("l", "Litre (l)", 1),
      scaled("m3", "Metreküp (m³)", 1000),
      scaled("gal", "Galon (ABD)", 3.78541),
    ],
  },
  {
    id: "alan",
    label: "Alan",
    units: [
      scaled("mm2", "Milimetrekare (mm²)", 0.000001),
      scaled("cm2", "Santimetrekare (cm²)", 0.0001),
      scaled("m2", "Metrekare (m²)", 1),
      scaled("ha", "Hektar (ha)", 10000),
      scaled("km2", "Kilometrekare (km²)", 1000000),
      scaled("ac", "Acre (ac)", 4046.86),
    ],
  },
  {
    id: "sicaklik",
    label: "Sıcaklık",
    units: [
      { id: "c", label: "Santigrat (°C)", toBase: (v) => v, fromBase: (v) => v },
      {
        id: "f",
        label: "Fahrenhayt (°F)",
        toBase: (v) => (v - 32) / 1.8,
        fromBase: (v) => v * 1.8 + 32,
      },
      {
        id: "k",
        label: "Kelvin (K)",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
];

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

function format(value: number): string {
  if (!Number.isFinite(value)) return "…";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1000000000 || abs < 0.000001)) {
    return value.toExponential(4);
  }
  return String(Number(value.toFixed(6)));
}

export default function BirimDonusturucu() {
  const [catId, setCatId] = useState("uzunluk");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");
  const [copied, setCopied] = useState(false);

  const category = CATEGORIES.find((item) => item.id === catId) ?? CATEGORIES[0];

  function changeCategory(nextId: string) {
    const next = CATEGORIES.find((item) => item.id === nextId);
    if (!next) return;
    setCatId(nextId);
    setFrom(next.units[0].id);
    setTo(next.units[1].id);
    setCopied(false);
  }

  const result = useMemo(() => {
    const fromUnit = category.units.find((unit) => unit.id === from);
    const toUnit = category.units.find((unit) => unit.id === to);
    if (!fromUnit || !toUnit) return null;
    const n = parseNumber(value);
    if (!Number.isFinite(n)) return null;
    return toUnit.fromBase(fromUnit.toBase(n));
  }, [category, value, from, to]);

  function copyResult() {
    if (result === null) return;
    navigator.clipboard
      .writeText(format(result))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeCategory(item.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              item.id === catId
                ? "bg-accent text-on-accent"
                : "border border-border bg-surface text-muted hover:border-strong hover:text-text"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="birim-deger" className="block text-sm font-medium text-text">
            Değer
          </label>
          <input
            id="birim-deger"
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="örn. 120,5"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="birim-birim" className="block text-sm font-medium text-text">
            Birim
          </label>
          <select
            id="birim-birim"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            {category.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setFrom(to);
            setTo(from);
            setCopied(false);
          }}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          Kaynak ve hedef birimi değiştir
        </button>
      </div>

      <div className="mt-3">
        <label htmlFor="birim-hdef" className="block text-sm font-medium text-text">
          Hedef birim
        </label>
        <select
          id="birim-hdef"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
        >
          {category.units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 rounded-lg border border-border bg-bg p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted">Sonuç</p>
            <p className="mt-1 truncate text-2xl font-semibold tabular-nums tracking-tight text-text">
              {result === null ? "…" : format(result)}
            </p>
          </div>
          <button
            type="button"
            onClick={copyResult}
            disabled={result === null}
            className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
          >
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Çok küçük veya çok büyük sonuçlar bilimsel gösterimle yazılır. Tüm
        dönüşümler tarayıcınızda anında yapılır.
      </p>
    </div>
  );
}