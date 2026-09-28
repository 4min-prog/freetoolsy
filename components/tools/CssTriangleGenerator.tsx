"use client";

import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

const DIRECTIONS = [
  "up",
  "down",
  "left",
  "right",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
] as const;
type Direction = (typeof DIRECTIONS)[number];

const DIRECTION_STYLE: Record<Direction, (size: number) => CSSProperties> = {
  up: (size) => ({
    width: "0",
    height: "0",
    borderLeft: `${size / 2}px solid transparent`,
    borderRight: `${size / 2}px solid transparent`,
    borderBottom: `${size}px solid var(--triangle-color, #6366f1)`,
  }),
  down: (size) => ({
    width: "0",
    height: "0",
    borderLeft: `${size / 2}px solid transparent`,
    borderRight: `${size / 2}px solid transparent`,
    borderTop: `${size}px solid var(--triangle-color, #6366f1)`,
  }),
  left: (size) => ({
    width: "0",
    height: "0",
    borderTop: `${size / 2}px solid transparent`,
    borderBottom: `${size / 2}px solid transparent`,
    borderRight: `${size}px solid var(--triangle-color, #6366f1)`,
  }),
  right: (size) => ({
    width: "0",
    height: "0",
    borderTop: `${size / 2}px solid transparent`,
    borderBottom: `${size / 2}px solid transparent`,
    borderLeft: `${size}px solid var(--triangle-color, #6366f1)`,
  }),
  topLeft: (size) => ({
    width: "0",
    height: "0",
    borderTop: `${size}px solid var(--triangle-color, #6366f1)`,
    borderRight: `${size / 2}px solid transparent`,
  }),
  topRight: (size) => ({
    width: "0",
    height: "0",
    borderTop: `${size}px solid var(--triangle-color, #6366f1)`,
    borderLeft: `${size / 2}px solid transparent`,
  }),
  bottomLeft: (size) => ({
    width: "0",
    height: "0",
    borderBottom: `${size}px solid var(--triangle-color, #6366f1)`,
    borderRight: `${size / 2}px solid transparent`,
  }),
  bottomRight: (size) => ({
    width: "0",
    height: "0",
    borderBottom: `${size}px solid var(--triangle-color, #6366f1)`,
    borderLeft: `${size / 2}px solid transparent`,
  }),
};

const DIRECTION_CSS: Record<Direction, (size: number, half: number, color: string) => string> = {
  up: (size, half, color) =>
    `  border-left: ${half}px solid transparent;\n  border-right: ${half}px solid transparent;\n  border-bottom: ${size}px solid ${color};`,
  down: (size, half, color) =>
    `  border-left: ${half}px solid transparent;\n  border-right: ${half}px solid transparent;\n  border-top: ${size}px solid ${color};`,
  left: (size, half, color) =>
    `  border-top: ${half}px solid transparent;\n  border-bottom: ${half}px solid transparent;\n  border-right: ${size}px solid ${color};`,
  right: (size, half, color) =>
    `  border-top: ${half}px solid transparent;\n  border-bottom: ${half}px solid transparent;\n  border-left: ${size}px solid ${color};`,
  topLeft: (size, half, color) =>
    `  border-top: ${size}px solid ${color};\n  border-right: ${half}px solid transparent;`,
  topRight: (size, half, color) =>
    `  border-top: ${size}px solid ${color};\n  border-left: ${half}px solid transparent;`,
  bottomLeft: (size, half, color) =>
    `  border-bottom: ${size}px solid ${color};\n  border-right: ${half}px solid transparent;`,
  bottomRight: (size, half, color) =>
    `  border-bottom: ${size}px solid ${color};\n  border-left: ${half}px solid transparent;`,
};

export default function CssTriangleGenerator() {
  const [direction, setDirection] = useState<Direction>("up");
  const [size, setSize] = useState("80");
  const [color, setColor] = useState("#6366f1");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.cssTriangleGenerator");

  const px = Math.max(Number(size) || 0, 1);
  const half = px / 2;

  const css = [
    ".triangle {",
    "  width: 0;",
    "  height: 0;",
    DIRECTION_CSS[direction](px, half, color),
    "}",
  ].join("\n");

  function copyCss() {
    copyToClipboard(css).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div>
      <div className="grid max-w-lg gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <p className="text-xs font-medium text-muted">{t("direction")}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {DIRECTIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDirection(value)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  direction === value
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-surface text-muted hover:text-foreground"
                }`}
              >
                {t(value)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="ctg-size" className="block text-xs font-medium text-muted">
            {t("size")}
          </label>
          <input
            id="ctg-size"
            type="number"
            min={1}
            max={300}
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="ctg-color" className="block text-xs font-medium text-muted">
            {t("color")}
          </label>
          <input
            id="ctg-color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-border bg-bg p-1"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface">
          <div
            style={
              {
                ...DIRECTION_STYLE[direction](px),
                "--triangle-color": color,
              } as CSSProperties
            }
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-text">{t("cssOutput")}</p>
            <button
              type="button"
              onClick={copyCss}
              className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-foreground hover:text-foreground"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <pre className="mt-2 overflow-auto rounded-lg border border-border bg-bg p-3 text-xs leading-relaxed text-text">
            {css}
          </pre>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}