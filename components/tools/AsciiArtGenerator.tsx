"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

const CHARS = " .:-=+*#%@";

export default function AsciiArtGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [width, setWidth] = useState("120");
  const [invert, setInvert] = useState(false);
  const [art, setArt] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const t = useTranslations("comp.asciiArtGenerator");

  function loadFile(file: File) {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImageUrl(url);
      setArt("");
      generate(image, Number(width), invert);
    };
    image.src = url;
  }

  function generate(image: HTMLImageElement, cols: number, inverted: boolean) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rows = Math.max(Math.round((cols * image.naturalHeight) / image.naturalWidth), 1);
    canvas.width = cols;
    canvas.height = rows;
    context.clearRect(0, 0, cols, rows);
    context.drawImage(image, 0, 0, cols, rows);
    const data = context.getImageData(0, 0, cols, rows).data;
    let output = "";
    const ramp = inverted ? CHARS.split("").reverse().join("") : CHARS;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = (y * cols + x) * 4;
        const gray = 0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2];
        const charIndex = Math.min(
          Math.floor((gray / 255) * (ramp.length - 1)),
          ramp.length - 1
        );
        output += ramp[charIndex] + (ramp[charIndex] === " " ? " " : "");
      }
      output += "\n";
    }
    setArt(output);
  }

  function regenerate() {
    if (!imageUrl) return;
    const image = new Image();
    image.onload = () => generate(image, Math.min(Number(width) || 40, 400), invert);
    image.src = imageUrl;
  }

  function changeWidth(value: string) {
    setWidth(value);
    if (imageUrl) {
      const image = new Image();
      image.onload = () => generate(image, Math.min(Number(value) || 40, 400), invert);
      image.src = imageUrl;
    }
  }

  function toggleInvert() {
    const next = !invert;
    setInvert(next);
    if (imageUrl) {
      const image = new Image();
      image.onload = () => generate(image, Math.min(Number(width) || 40, 400), next);
      image.src = imageUrl;
    }
  }

  async function copy() {
    if (!art) return;
    try {
      await navigator.clipboard.writeText(art);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function clear() {
    setImageUrl(null);
    setArt("");
    setWidth("120");
    setInvert(false);
    setCopied(false);
  }

  return (
    <div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-md">
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface text-center transition-colors hover:border-accent">
          <span className="px-4 py-6 text-sm text-muted">
            {imageUrl ? t("chosen") : t("uploadHint")}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) loadFile(file);
            }}
          />
        </label>
      </div>

      {imageUrl ? (
        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="aag-width" className="block text-xs font-medium text-muted">
              {t("widthLabel")}
            </label>
            <input
              id="aag-width"
              type="number"
              min={20}
              max={400}
              value={width}
              onChange={(event) => changeWidth(event.target.value)}
              className="mt-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <label className="flex items-center gap-2 pb-2.5 text-sm text-muted">
            <input
              type="checkbox"
              checked={invert}
              onChange={toggleInvert}
              className="h-4 w-4 accent-accent"
            />
            {t("invert")}
          </label>
          <button
            type="button"
            onClick={regenerate}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("generate")}
          </button>
        </div>
      ) : null}

      {art ? (
        <>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied ? t("copied") : t("copy")}
            </button>
            <button
              type="button"
              onClick={clear}
              className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {t("clear")}
            </button>
          </div>
          <div className="mt-6 overflow-auto rounded-lg border border-border bg-bg p-3">
            <pre className="text-[7px] leading-[7px] text-text">{art}</pre>
          </div>
        </>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}