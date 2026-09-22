"use client";

import { useState } from "react";

type Rgb = [number, number, number];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(value: string): Rgb | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  const hex = match[1];
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function rgbToHex(rgba: Rgb): string {
  return (
    "#" +
    rgba
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(rgba: Rgb): { h: number; s: number; l: number } {
  const r = rgba[0] / 255;
  const g = rgba[1] / 255;
  const b = rgba[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const hh = h / 360;
  const ss = s / 100;
  const ll = l / 100;
  let r = ll;
  let g = ll;
  let b = ll;
  if (ss !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
    const p = 2 * ll - q;
    r = hue2rgb(p, q, hh + 1 / 3);
    g = hue2rgb(p, q, hh);
    b = hue2rgb(p, q, hh - 1 / 3);
  }
  return [
    Math.round(clamp(r * 255, 0, 255)),
    Math.round(clamp(g * 255, 0, 255)),
    Math.round(clamp(b * 255, 0, 255)),
  ];
}

function parseRgb(value: string): Rgb | null {
  const parts = value.split(",").map((x) => x.trim());
  if (parts.length !== 3) return null;
  const nums = parts.map(Number);
  for (let i = 0; i < nums.length; i++) {
    if (!Number.isFinite(nums[i]) || nums[i] < 0 || nums[i] > 255) return null;
  }
  return [nums[0], nums[1], nums[2]];
}

function parseHsl(value: string): Rgb | null {
  const parts = value.split(",").map((x) => x.trim());
  if (parts.length !== 3) return null;
  const h = Number(parts[0]);
  const s = Number(parts[1].replace("%", ""));
  const l = Number(parts[2].replace("%", ""));
  if (
    !Number.isFinite(h) ||
    !Number.isFinite(s) ||
    !Number.isFinite(l) ||
    h < 0 ||
    h > 360 ||
    s < 0 ||
    s > 100 ||
    l < 0 ||
    l > 100
  ) {
    return null;
  }
  return hslToRgb(h, s, l);
}

const START: Rgb = [37, 99, 235];
const START_HSL = rgbToHsl(START);

export default function RenkDonusturucu() {
  const [rgb, setRgb] = useState<Rgb>(START);
  const [hexDraft, setHexDraft] = useState(rgbToHex(START));
  const [rgbDraft, setRgbDraft] = useState(START.join(", "));
  const [hslDraft, setHslDraft] = useState(
    `${START_HSL.h}, ${START_HSL.s}%, ${START_HSL.l}%`
  );
  const [copied, setCopied] = useState<string | null>(null);

  function apply(next: Rgb) {
    setRgb(next);
    setHexDraft(rgbToHex(next));
    setRgbDraft(next.join(", "));
    const hsl = rgbToHsl(next);
    setHslDraft(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
  }

  function onHexChange(value: string) {
    setHexDraft(value);
    const parsed = hexToRgb(value);
    if (parsed) apply(parsed);
  }

  function onRgbChange(value: string) {
    setRgbDraft(value);
    const parsed = parseRgb(value);
    if (parsed) apply(parsed);
  }

  function onHslChange(value: string) {
    setHslDraft(value);
    const parsed = parseHsl(value);
    if (parsed) apply(parsed);
  }

  function copyValue(value: string, key: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => undefined);
  }

  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  const textOn = luminance > 0.5 ? "#000000" : "#ffffff";

  const fields: { key: string; label: string; value: string; onChange: (v: string) => void }[] = [
    { key: "hex", label: "HEX", value: hexDraft, onChange: onHexChange },
    { key: "rgb", label: "RGB", value: rgbDraft, onChange: onRgbChange },
    { key: "hsl", label: "HSL", value: hslDraft, onChange: onHslChange },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex h-14 w-16 cursor-pointer items-center gap-3 text-sm font-medium text-text">
          <input
            type="color"
            value={rgbToHex(rgb)}
            onChange={(event) => {
              const parsed = hexToRgb(event.target.value);
              if (parsed) apply(parsed);
            }}
            className="h-12 w-16 cursor-pointer rounded-lg border border-border bg-surface p-1"
          />
        </label>
        <span className="text-sm text-muted">
          Renk seçin veya aşağıdaki değerlerden birini düzenleyin
        </span>
      </div>

      <div
        className="mt-4 flex h-24 items-center justify-center rounded-lg border border-border"
        style={{ backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, color: textOn }}
      >
        <span className="text-sm font-semibold">Önizleme {rgbToHex(rgb)}</span>
      </div>

      <div className="mt-5 space-y-3">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center gap-3">
            <label htmlFor={`renk-${field.key}`} className="w-12 shrink-0 text-sm font-medium text-text">
              {field.label}
            </label>
            <input
              id={`renk-${field.key}`}
              type="text"
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              spellCheck={false}
              className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <button
              type="button"
              onClick={() => copyValue(field.value, field.key)}
              className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied === field.key ? "Kopyalandı" : "Kopyala"}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Geçersiz bir değer girerseniz son alan güncellenene kadar mevcut renk
        korunur. Web sayfaları ve tasarım araçları için hızlı ve güvenilir
        dönüşüm.
      </p>
    </div>
  );
}