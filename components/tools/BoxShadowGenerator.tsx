"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function SliderRow(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={props.id} className="text-sm font-medium text-text">
          {props.label}
        </label>
        <input
          type="number"
          value={props.value}
          min={props.min}
          max={props.max}
          step={props.step}
          onChange={(event) => props.onChange(Number(event.target.value))}
          className="w-20 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-right font-mono text-sm text-text focus:border-accent focus:outline-none"
        />
      </div>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(event) => props.onChange(Number(event.target.value))}
        className="mt-2 w-full cursor-pointer accent-accent"
      />
    </div>
  );
}

export default function BoxShadowGenerator() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(8);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(25);
  const [color, setColor] = useState("#000000");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.boxShadowGenerator");

  const cssLine = useMemo(() => {
    const rgb = hexToRgb(color);
    const alpha = (opacity / 100).toFixed(2);
    return `box-shadow: ${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha});`;
  }, [offsetX, offsetY, blur, spread, opacity, color]);

  const previewShadow = useMemo(() => {
    const rgb = hexToRgb(color);
    const alpha = opacity / 100;
    return `${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }, [offsetX, offsetY, blur, spread, opacity, color]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(cssLine);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-4">
          <SliderRow
            id="golge-offset-x"
            label={t("offsetX")}
            value={offsetX}
            min={-50}
            max={50}
            step={1}
            onChange={setOffsetX}
          />
          <SliderRow
            id="golge-offset-y"
            label={t("offsetY")}
            value={offsetY}
            min={-50}
            max={50}
            step={1}
            onChange={setOffsetY}
          />
          <SliderRow
            id="golge-bulaniklik"
            label={t("blur")}
            value={blur}
            min={0}
            max={100}
            step={1}
            onChange={setBlur}
          />
          <SliderRow
            id="golge-yayilma"
            label={t("spread")}
            value={spread}
            min={-50}
            max={50}
            step={1}
            onChange={setSpread}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="golge-opaklik" className="text-sm font-medium text-text">
                {t("opacity")}
              </label>
              <input
                type="number"
                value={opacity}
                min={0}
                max={100}
                onChange={(event) => setOpacity(Number(event.target.value))}
                className="w-20 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-right font-mono text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>
            <input
              id="golge-opaklik"
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(event) => setOpacity(Number(event.target.value))}
              className="mt-2 w-full cursor-pointer accent-accent"
            />
          </div>
          <div>
            <label htmlFor="golge-renk" className="block text-sm font-medium text-text">
              {t("color")}
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="golge-renk"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-bg p-1"
              />
              <span className="font-mono text-sm text-text">
                {color.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => { setOffsetX(0); setOffsetY(8); setBlur(24); setSpread(0); setOpacity(25); setColor("#3b82f6"); }} />
      </div>

      <div className="mt-6 flex h-48 items-center justify-center rounded-lg border border-border bg-bg">
        <div
          className="h-24 w-44 rounded-xl border border-border bg-surface"
          style={{ boxShadow: previewShadow }}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text">{t("outputLabel")}</p>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <input
        type="text"
        value={cssLine}
        readOnly
        spellCheck={false}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text focus:border-accent focus:outline-none"
      />
    </div>
  );
}
