"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type Rgb = { r: number; g: number; b: number };

type Hsl = { h: number; s: number; l: number };

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHsl(rgb: Rgb): Hsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(hsl: Hsl): string {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = Math.min(100, Math.max(0, hsl.s)) / 100;
  const l = Math.min(100, Math.max(0, hsl.l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return (
    "#" +
    [r, g, b]
      .map((value) =>
        Math.round((value + m) * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

export default function RenkPaletiUretici() {
  const [base, setBase] = useState("#2563EB");
  const [count, setCount] = useState<"5" | "7" | "9">("5");
  const [mode, setMode] = useState<"analogous" | "monochrome">("analogous");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const t = useTranslations("comp.renkPaleti");

  const palette = useMemo(() => {
    const hsl = rgbToHsl(hexToRgb(base));
    const size = Number(count);
    if (mode === "monochrome") {
      return Array.from({ length: size }, (_, index) =>
        hslToHex({
          h: hsl.h,
          s: hsl.s,
          l: Math.round(15 + (70 * index) / (size - 1)),
        })
      );
    }
    const mid = (size - 1) / 2;
    return Array.from({ length: size }, (_, index) =>
      hslToHex({
        h: hsl.h + Math.round((index - mid) * 30),
        s: hsl.s,
        l: hsl.l,
      })
    );
  }, [base, count, mode]);

  async function copySwatch(hex: string, index: number) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      setCopiedIndex(null);
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="palet-ana-renk"
            className="block text-sm font-medium text-text"
          >
            {t("baseLabel")}
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="palet-ana-renk"
              type="color"
              value={base}
              onChange={(event) => setBase(event.target.value)}
              className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-bg p-1"
            />
            <span className="font-mono text-sm text-text">{base.toUpperCase()}</span>
          </div>
        </div>
        <div>
          <label
            htmlFor="palet-adet"
            className="block text-sm font-medium text-text"
          >
            {t("countLabel")}
          </label>
          <select
            id="palet-adet"
            value={count}
            onChange={(event) => setCount(event.target.value as "5" | "7" | "9")}
            className="mt-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="9">9</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("analogous")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "analogous"
              ? "bg-accent text-on-accent hover:opacity-90"
              : "border border-border bg-surface text-muted hover:border-strong hover:text-text"
          }`}
        >
          {t("analogous")}
        </button>
        <button
          type="button"
          onClick={() => setMode("monochrome")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "monochrome"
              ? "bg-accent text-on-accent hover:opacity-90"
              : "border border-border bg-surface text-muted hover:border-strong hover:text-text"
          }`}
        >
          {t("monochrome")}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {palette.map((hex, index) => (
          <button
            key={index}
            type="button"
            onClick={() => copySwatch(hex, index)}
            aria-label={t("copy")}
            className="group flex flex-col items-center gap-1.5"
          >
            <span
              className="h-16 w-full rounded-lg border border-border transition-transform group-hover:scale-105"
              style={{ backgroundColor: hex }}
            />
            <span className="font-mono text-[10px] text-muted">
              {copiedIndex === index ? t("copied") : hex}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}