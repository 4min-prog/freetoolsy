"use client";

import { useMemo, useState } from "react";

const DAY_MS = 86400000;

function todayInput(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function TarihFarki() {
  const [start, setStart] = useState(todayInput());
  const [end, setEnd] = useState(todayInput());

  const result = useMemo(() => {
    const a = new Date(`${start}T00:00:00`);
    const b = new Date(`${end}T00:00:00`);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
    const ms = Math.abs(b.getTime() - a.getTime());
    const totalDays = Math.floor(ms / DAY_MS);
    const years = Math.floor(totalDays / 365.2425);
    const rem = totalDays - Math.floor(years * 365.2425);
    const months = Math.floor(rem / 30.4368);
    const days = Math.floor(rem - months * 30.4368 + 0.00001);
    const weeks = Math.floor(totalDays / 7);
    const hours = totalDays * 24;
    const minutes = hours * 60;
    return {
      years,
      months,
      days,
      weeks,
      totalDays,
      hours,
      minutes,
    };
  }, [start, end]);

  const rows = result
    ? [
        { label: "Toplam gün", value: result.totalDays },
        { label: "Toplam hafta", value: result.weeks },
        { label: "Toplam ay (ortalama)", value: Math.floor(result.totalDays / 30.4368) },
        { label: "Toplam saat", value: result.hours },
        { label: "Toplam dakika", value: result.minutes },
      ]
    : [];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tarih-baslangic" className="block text-sm font-medium text-text">
            Başlangıç tarihi
          </label>
          <input
            id="tarih-baslangic"
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="tarih-bitis" className="block text-sm font-medium text-text">
            Bitiş tarihi
          </label>
          <input
            id="tarih-bitis"
            type="date"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      {result ? (
        <div className="mt-5 rounded-lg border border-border bg-bg p-5">
          <p className="text-sm font-medium text-text">
            Aradaki fark:{" "}
            <span className="font-semibold tabular-nums text-accent">
              {result.years} yıl, {result.months} ay, {result.days} gün
            </span>
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {rows.map((row) => (
              <div key={row.label} className="bg-surface px-4 py-3">
                <dt className="text-xs text-muted">{row.label}</dt>
                <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
                  {row.value.toLocaleString("tr-TR")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <p role="alert" className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger">
          Lütfen geçerli iki tarih seçin.
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Hangi tarih önce olursa olsun farkın mutlak değeri gösterilir.
        Yıl/ay/gün dönüşümü takvim ortalamalarına dayanır; gün bazlı
        hesaplamalar kesindir.
      </p>
    </div>
  );
}