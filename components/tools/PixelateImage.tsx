"use client";

import { exceedsCanvasLimit } from "@/lib/canvasLimit";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function PixelateImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState(12);
  const [resultUrl, setResultUrl] = useState("");
  const [ready, setReady] = useState(false);
  const sourceRef = useRef<CanvasRenderingContext2D | null>(null);
  const sourceSize = useRef({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const t = useTranslations("comp.pixelateImage");

  function loadFile(file: File) {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImageUrl(url);
      sourceSize.current = { width: image.naturalWidth, height: image.naturalHeight };
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      if (exceedsCanvasLimit(image.naturalWidth, image.naturalHeight)) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
      sourceRef.current = context;
      setReady(true);
      pixelate(image.naturalWidth, image.naturalHeight, pixelSize);
    };
    image.src = url;
  }

  function pixelate(width: number, height: number, block: number) {
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!canvas || !source) return;
    const safe = Math.max(block, 1);
    const small = document.createElement("canvas");
    small.width = Math.max(Math.round(width / safe), 1);
    small.height = Math.max(Math.round(height / safe), 1);
    const smallContext = small.getContext("2d");
    if (!smallContext) return;
    smallContext.imageSmoothingEnabled = false;
    smallContext.drawImage(canvas, 0, 0, small.width, small.height);
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.imageSmoothingEnabled = false;
    context.drawImage(small, 0, 0, width, height);
    setResultUrl(canvas.toDataURL("image/png"));
  }

  function clear() {
    setImageUrl(null);
    setResultUrl("");
    setReady(false);
    setPixelSize(12);
  }

  function changeSize(value: number) {
    setPixelSize(value);
    if (ready) pixelate(sourceSize.current.width, sourceSize.current.height, value);
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
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="min-w-48">
            <label htmlFor="pi-size" className="block text-xs font-medium text-muted">
              {t("pixelSize")}: {pixelSize}px
            </label>
            <input
              id="pi-size"
              type="range"
              min={2}
              max={64}
              value={pixelSize}
              onChange={(event) => changeSize(Number(event.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </div>
          {resultUrl ? (
            <a
              href={resultUrl}
              download="pixelated.png"
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {t("download")}
            </a>
          ) : null}
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {t("clear")}
          </button>
        </div>
      ) : null}

      {resultUrl ? (
        <div className="mt-6">
          <img
            src={resultUrl}
            alt={t("previewAlt")}
            className="max-h-96 rounded-lg border border-border"
          />
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}