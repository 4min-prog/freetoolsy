"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

type Rgb = { r: number; g: number; b: number };

const HEX_RE = /^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

function clamp(value: number, min = 0, max = 255): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(value: string): string {
  if (!HEX_RE.test(value)) return "";
  const hex = value.toUpperCase();
  if (hex.length === 3) {
    return hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  return hex;
}

function hexToRgb(hex: string): Rgb | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(rgb: Rgb): string {
  return [rgb.r, rgb.g, rgb.b]
    .map((value) => clamp(value).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function rgbToHsl(rgb: Rgb) {
  const r = clamp(rgb.r) / 255;
  const g = clamp(rgb.g) / 255;
  const b = clamp(rgb.b) / 255;
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
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHsv(rgb: Rgb) {
  const r = clamp(rgb.r) / 255;
  const g = clamp(rgb.g) / 255;
  const b = clamp(rgb.b) / 255;
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
  return {
    h: Math.round(h),
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    v: Math.round(max * 100),
  };
}

function rgbToCmyk(rgb: Rgb) {
  const r = clamp(rgb.r) / 255;
  const g = clamp(rgb.g) / 255;
  const b = clamp(rgb.b) / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function rgbToText(rgb: Rgb): string {
  return `rgb(${clamp(rgb.r)}, ${clamp(rgb.g)}, ${clamp(rgb.b)})`;
}

function shade(rgb: Rgb, percent: number): Rgb {
  const factor = 1 - percent;
  return {
    r: Math.round(clamp(rgb.r) * Math.min(1, factor + 0.001)),
    g: Math.round(clamp(rgb.g) * Math.min(1, factor + 0.001)),
    b: Math.round(clamp(rgb.b) * Math.min(1, factor + 0.001)),
  };
}

function tint(rgb: Rgb, percent: number): Rgb {
  const amount = clamp(percent, 0, 1);
  return {
    r: Math.round(clamp(rgb.r) + (255 - clamp(rgb.r)) * amount),
    g: Math.round(clamp(rgb.g) + (255 - clamp(rgb.g)) * amount),
    b: Math.round(clamp(rgb.b) + (255 - clamp(rgb.b)) * amount),
  };
}

function Row(props: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-20 shrink-0 text-xs font-medium text-muted">{props.label}</span>
      <code className="min-w-0 flex-1 break-all font-mono text-sm text-text">{props.value}</code>
    </div>
  );
}

export default function RenkDonusturucu() {
  const [hex, setHex] = useState("#2563EB");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.renk");

  const rgb = useMemo(() => hexToRgb(hex.replace("#", "")), [hex]);

  const hsl = rgb ? rgbToHsl(rgb) : null;
  const hsv = rgb ? rgbToHsv(rgb) : null;
  const cmyk = rgb ? rgbToCmyk(rgb) : null;

  function copy(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true); showToast();
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className="h-40 w-full shrink-0 rounded-lg border border-border sm:h-auto sm:w-40"
          style={{ backgroundColor: rgb ? rgbToText(rgb) : "#000000" }}
        >
          <input
            type="color"
            value={rgb ? rgbToHex(rgb) : "#000000"}
            onChange={(event) => setHex(event.target.value.toUpperCase())}
            aria-label={t("pickerAria")}
            className="h-full w-full cursor-pointer opacity-0"
          />
        </div>

        <div className="min-w-0 flex-1">
          <label htmlFor="renk-hex" className="block text-sm font-medium text-text">
            {t("hexLabel")}
          </label>
          <input
            id="renk-hex"
            type="text"
            value={hex}
            onChange={(event) => setHex(event.target.value)}
            spellCheck={false}
            placeholder="#2563EB"
            className="mt-2 w-full font-mono text-sm rounded-lg border border-border bg-bg px-3.5 py-2.5 text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />

          <div className="mt-2 flex flex-wrap gap-2">
            <SampleButton onApply={() => setHex(SAMPLES["renk-donusturucu"])} />
          </div>

          {rgb ? (
            <div className="mt-2 overflow-hidden rounded-lg border border-border bg-bg">
              <Row label="HEX" value={`#${rgbToHex(rgb)}`} />
              <div className="border-t border-border">
                <Row label="RGB" value={rgbToText(rgb)} />
              </div>
              {hsl ? (
                <div className="border-t border-border">
                  <Row
                    label="HSL"
                    value={`hsl(${hsl.h}, ${hsl.s}, ${hsl.l})`}
                  />
                </div>
              ) : null}
              {hsv ? (
                <div className="border-t border-border">
                  <Row
                    label="HSV"
                    value={`hsv(${hsv.h}, ${hsv.s}, ${hsv.v})`}
                  />
                </div>
              ) : null}
              {cmyk ? (
                <div className="border-t border-border">
                  <Row label="CMYK" value={`cmyk(${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k})`} />
                </div>
              ) : null}
            </div>
          ) : (
            <p role="alert" className="mt-3 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger">
              {t("invalid")}
            </p>
          )}

          <button
            type="button"
            onClick={() => copy(rgb ? rgbToText(rgb) : hex)}
            disabled={!rgb}
            className="mt-3 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </div>

      {rgb ? (
        <div className="mt-6">
          <p className="text-sm font-medium text-text">{t("shadesTitle")}</p>
          <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
            {[20, 40, 60, 80].map((percent) => {
              const color = shade(rgb, percent / 100);
              const text = `#${rgbToHex(color)}`;
              return (
                <button
                  key={percent}
                  type="button"
                  onClick={() => setHex(text)}
                  className="flex shrink-0 flex-col items-center gap-1.5"
                >
                  <span
                    className="h-12 w-12 rounded-lg border border-border"
                    style={{ backgroundColor: rgbToText(color) }}
                  />
                  <span className="font-mono text-[10px] text-muted">
                    {String(percent)}%
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setHex(`#${rgbToHex(rgb)}`)}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className="h-12 w-12 rounded-lg border-2 border-accent"
                style={{ backgroundColor: rgbToText(rgb) }}
              />
              <span className="font-mono text-[10px] text-accent">0%</span>
            </button>
            {[20, 40, 60, 80].map((percent) => {
              const color = tint(rgb, percent / 100);
              const text = `#${rgbToHex(color)}`;
              return (
                <button
                  key={percent}
                  type="button"
                  onClick={() => setHex(text)}
                  className="flex shrink-0 flex-col items-center gap-1.5"
                >
                  <span
                    className="h-12 w-12 rounded-lg border border-border"
                    style={{ backgroundColor: rgbToText(color) }}
                  />
                  <span className="font-mono text-[10px] text-muted">
                    +{String(percent)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-muted">{t("copyNote")}</p>
    </div>
  );
}