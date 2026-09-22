"use client";

import { useMemo, useState } from "react";

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

const CATEGORIES = [
  { max: 18.5, label: "Düşük kilo", note: "Vücut kitle indeksiniz normalin altında." },
  { max: 25, label: "Normal kilo", note: "Vücut kitle indeksiniz sağlıklı aralıkta." },
  { max: 30, label: "Fazla kilo", note: "Vücut kitle indeksiniz normalin üzerinde." },
  { max: Infinity, label: "Obezite", note: "Vücut kitle indeksiniz obezite aralığında." },
];

const SCALE_MAX = 40;

export default function BmiHesaplayici() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const result = useMemo(() => {
    const h = parseNumber(height);
    const w = parseNumber(weight);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h < 50 || h > 250 || w < 10 || w > 400) {
      return null;
    }
    const meters = h / 100;
    const bmi = w / (meters * meters);
    const category = CATEGORIES.find((item) => bmi < item.max) ?? CATEGORIES[3];
    return { bmi, category };
  }, [height, weight]);

  const markerPercent = result
    ? Math.min(100, Math.max(0, (result.bmi / SCALE_MAX) * 100))
    : null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bmi-boy" className="block text-sm font-medium text-text">
            Boy (cm)
          </label>
          <input
            id="bmi-boy"
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="örn. 175"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="bmi-kilo" className="block text-sm font-medium text-text">
            Kilo (kg)
          </label>
          <input
            id="bmi-kilo"
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="örn. 70"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Virgül veya nokta kullanabilirsiniz. Değerler yalnızca bu tarayıcıda
        işlenir.
      </p>

      {result ? (
        <div className="mt-6 rounded-lg border border-border bg-bg p-5">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold tabular-nums tracking-tight text-text">
              {result.bmi.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-accent">{result.category.label}</span>
          </div>

          <div
            className="relative mt-5 h-2 overflow-hidden rounded-full"
            role="img"
            aria-label={`BMI ${result.bmi.toFixed(1)}, ${result.category.label}`}
          >
            <div className="absolute inset-0 flex">
              <span className="h-full bg-[#93C5FD]" style={{ width: `${(18.5 / SCALE_MAX) * 100}%` }} />
              <span className="h-full bg-[#6EE7B7]" style={{ width: `${((25 - 18.5) / SCALE_MAX) * 100}%` }} />
              <span className="h-full bg-[#FCD34D]" style={{ width: `${((30 - 25) / SCALE_MAX) * 100}%` }} />
              <span className="h-full bg-[#FCA5A5]" style={{ width: `${((SCALE_MAX - 30) / SCALE_MAX) * 100}%` }} />
            </div>
            <span
              className="absolute top-1/2 h-4 w-1.5 -translate-y-1/2 rounded-full border border-surface bg-text"
              style={{ left: `calc(${markerPercent}% - 3px)` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-muted">
            <span>15</span>
            <span>18,5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">{result.category.note}</p>
          <p className="mt-2 text-xs leading-relaxed text-faint">
            BMI bir tıbbi tanı aracı değildir; yaş, kas kütlesi ve diğer
            faktörleri dikkate almaz.
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">
            Sonucu görmek için boy ve kilonuzu girin.
          </p>
        </div>
      )}
    </div>
  );
}
