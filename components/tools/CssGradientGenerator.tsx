"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function CssGradientGenerator() {
  const t = useTranslations("comp.cssGradientGenerator");
  const [direction, setDirection] = useState("to right");
  const [angle, setAngle] = useState(90);
  const [colorA, setColorA] = useState("#2563eb");
  const [colorB, setColorB] = useState("#7c3aed");
  const [three, setThree] = useState(false);
  const [colorC, setColorC] = useState("#ec4899");
  const [stop, setStop] = useState(50);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const middlePart = three ? `, ${colorB} ${stop}%` : "";
    const endPart = three ? `, ${colorC} 100%` : `, ${colorB} 100%`;
    return `background: linear-gradient(${angle}deg, ${colorA} 0%${middlePart}${endPart});`;
  }, [angle, colorA, colorB, colorC, three, stop]);

  const previewStyle = {
    background: `linear-gradient(${angle}deg, ${colorA} 0%${
      three ? `, ${colorB} ${stop}%` : ""
    }${three ? `, ${colorC} 100%` : `, ${colorB} 100%`})`,
  };

  async function copy() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div className="grid gap-4">
        <div>
          <label
            htmlFor="grad-acik1"
            className="block text-sm font-medium text-text"
          >
            {t("colorA")}
          </label>
          <input
            id="grad-acik1"
            type="color"
            value={colorA}
            onChange={(event) => setColorA(event.target.value)}
            className="mt-1.5 h-10 w-full cursor-pointer rounded-lg border border-border bg-bg p-1"
          />
        </div>
        <div>
          <label
            htmlFor="grad-acik2"
            className="block text-sm font-medium text-text"
          >
            {t("colorB")}
          </label>
          <input
            id="grad-acik2"
            type="color"
            value={colorB}
            onChange={(event) => setColorB(event.target.value)}
            disabled={three}
            className="mt-1.5 h-10 w-full cursor-pointer rounded-lg border border-border bg-bg p-1 disabled:opacity-50"
          />
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-strong">
          <input
            type="checkbox"
            checked={three}
            onChange={(event) => {
              const next = event.target.checked;
              setThree(next);
              if (next) setStop(50);
            }}
            className="h-4 w-4 accent-[--color-accent]"
          />
          {t("useThree")}
        </label>

        {three && (
          <div>
            <label
              htmlFor="grad-oran"
              className="flex items-center justify-between text-sm font-medium text-text"
            >
              <span>{t("middleStop")}</span>
              <span className="text-xs tabular-nums text-faint">{stop}%</span>
            </label>
            <input
              id="grad-oran"
              type="range"
              min={0}
              max={100}
              value={stop}
              onChange={(event) => setStop(Number(event.target.value))}
              className="mt-2 w-full accent-[--color-accent]"
            />
          </div>
        )}

        {three && (
          <div>
            <label
              htmlFor="grad-acik3"
              className="block text-sm font-medium text-text"
            >
              {t("colorC")}
            </label>
            <input
              id="grad-acik3"
              type="color"
              value={colorC}
              onChange={(event) => setColorC(event.target.value)}
              className="mt-1.5 h-10 w-full cursor-pointer rounded-lg border border-border bg-bg p-1"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="grad-acilar"
            className="flex items-center justify-between text-sm font-medium text-text"
          >
            <span>{t("angle")}</span>
            <span className="text-xs tabular-nums text-faint">{angle}°</span>
          </label>
          <input
            id="grad-acilar"
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={(event) => {
              const next = Number(event.target.value);
              setAngle(next);
              setDirection("");
            }}
            className="mt-2 w-full accent-[--color-accent]"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              "to right",
              "to bottom",
              "to bottom right",
              "to left",
              "to top",
            ].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  const degrees: Record<string, number> = {
                    "to right": 90,
                    "to bottom": 180,
                    "to bottom right": 135,
                    "to left": 270,
                    "to top": 0,
                  };
                  setAngle(degrees[value]);
                  setDirection(value);
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  direction === value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-muted hover:border-strong hover:text-text"
                }`}
              >
                {t(`dir.${value.replaceAll(" ", "-")}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-bg p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-faint">
          {t("previewTitle")}
        </p>
        <div
          className="mt-3 h-32 w-full rounded-xl"
          style={previewStyle}
          aria-hidden="true"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            {t("cssLabel")}
          </p>
          <button
            type="button"
            onClick={copy}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface-2/50 p-4 font-mono text-xs leading-relaxed text-text">
          {css}
        </pre>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}