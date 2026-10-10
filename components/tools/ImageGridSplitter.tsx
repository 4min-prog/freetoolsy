"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Slice = { url: string; row: number; col: number };

export default function ImageGridSplitter() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [slices, setSlices] = useState<Slice[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const t = useTranslations("comp.imageGridSplitter");

  function loadFile(file: File) {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImageUrl(url);
      setSlices([]);
    };
    image.src = url;
  }

  function split() {
    if (!imageUrl) return;
    const image = new Image();
    image.onload = () => {
      const cellW = image.naturalWidth / cols;
      const cellH = image.naturalHeight / rows;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      const next: Slice[] = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          canvas.width = Math.round(cellW);
          canvas.height = Math.round(cellH);
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, col * cellW, row * cellH, cellW, cellH, 0, 0, cellW, cellH);
          next.push({ url: canvas.toDataURL("image/png"), row, col });
        }
      }
      setSlices(next);
    };
    image.src = imageUrl;
  }

  function clear() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setSlices([]);
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
        <div className="mt-6 max-w-md">
          <img
            src={imageUrl}
            alt={t("previewAlt")}
            className="max-h-64 w-full rounded-lg border border-border object-contain"
          />
        </div>
      ) : null}

      {imageUrl ? (
        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="igt-rows" className="block text-xs font-medium text-muted">
              {t("rows")}
            </label>
            <select
              id="igt-rows"
              value={rows}
              onChange={(event) => {
                setRows(Number(event.target.value));
                setSlices([]);
              }}
              className="mt-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="igt-cols" className="block text-xs font-medium text-muted">
              {t("columns")}
            </label>
            <select
              id="igt-cols"
              value={cols}
              onChange={(event) => {
                setCols(Number(event.target.value));
                setSlices([]);
              }}
              className="mt-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={split}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("split")}
          </button>
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {t("clear")}
          </button>
        </div>
      ) : null}

      {slices.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text">
            {t("slicesTitle")} ({slices.length})
          </h3>
          <div className="mt-3 grid max-w-md grid-cols-3 gap-2">
            {slices.map((slice) => (
              <div key={`${slice.row}-${slice.col}`} className="overflow-hidden rounded-lg border border-border">
                <img src={slice.url} alt={`${slice.row + 1}-${slice.col + 1}`} className="w-full" />
                <a
                  href={slice.url}
                  download={`slice-${slice.row + 1}-${slice.col + 1}.png`}
                  className="block bg-surface px-2 py-1 text-center text-xs text-muted transition-colors hover:text-foreground"
                >
                  {t("download")}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}