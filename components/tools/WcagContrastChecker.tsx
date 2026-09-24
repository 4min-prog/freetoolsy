"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

type Rgb = { r: number; g: number; b: number };

type Level = {
  key: "aaNormal" | "aaLarge" | "aaaNormal" | "aaaLarge";
  threshold: number;
};

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function relativeLuminance(rgb: Rgb): number {
  const channel = (value: number): number => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * channel(rgb.r) +
    0.7152 * channel(rgb.g) +
    0.0722 * channel(rgb.b)
  );
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function WcagContrastChecker() {
  const [fg, setFg] = useState("#2563EB");
  const [bg, setBg] = useState("#FFFFFF");
  const t = useTranslations("comp.wcagContrastChecker");

  const ratio = useMemo(
    () => contrastRatio(hexToRgb(fg), hexToRgb(bg)),
    [fg, bg]
  );

  const levels = useMemo<Level[]>(
    () => [
      { key: "aaNormal", threshold: 4.5 },
      { key: "aaLarge", threshold: 3 },
      { key: "aaaNormal", threshold: 7 },
      { key: "aaaLarge", threshold: 4.5 },
    ],
    []
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="wcag-fg"
            className="block text-sm font-medium text-text"
          >
            {t("fgLabel")}
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="wcag-fg"
              type="color"
              value={fg}
              onChange={(event) => setFg(event.target.value)}
              className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-bg p-1"
            />
            <span className="font-mono text-sm text-text">{fg.toUpperCase()}</span>
          </div>
        </div>
        <div>
          <label
            htmlFor="wcag-bg"
            className="block text-sm font-medium text-text"
          >
            {t("bgLabel")}
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="wcag-bg"
              type="color"
              value={bg}
              onChange={(event) => setBg(event.target.value)}
              className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-bg p-1"
            />
            <span className="font-mono text-sm text-text">{bg.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SampleButton onApply={() => { setFg("#ffffff"); setBg("#3b82f6"); }} />
      </div>

      <div
        className="mt-5 rounded-lg border border-border bg-bg py-8 text-center"
        style={{ backgroundColor: bg, color: fg }}
      >
        <p className="text-3xl font-semibold tracking-tight">Aa</p>
        <p className="mt-1 text-sm text-white mix-blend-difference">FreetoolsY</p>
      </div>

      <div className="mt-5 rounded-lg border border-border bg-bg px-4 py-4 text-center">
        <p className="text-xs text-muted">{t("ratio")}</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-text">
          {ratio.toFixed(2)}:1
        </p>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {levels.map((level) => {
          const pass = ratio >= level.threshold;
          return (
            <li
              key={level.key}
              className={`rounded-lg border px-3 py-2.5 text-center ${
                pass
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-danger/30 bg-danger/10 text-danger"
              }`}
            >
              <p className="text-xs font-normal text-muted">{t(level.key)}</p>
              <p className="mt-0.5 text-sm font-semibold">
                {pass ? t("pass") : t("fail")}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}