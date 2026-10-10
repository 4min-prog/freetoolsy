"use client";

import { exceedsCanvasLimit } from "@/lib/canvasLimit";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const MAX_DIST = Math.sqrt(3 * 255 * 255);

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function RemoveBg() {
  const [source, setSource] = useState("");
  const [meta, setMeta] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(35);
  const [mode, setMode] = useState<"global" | "contiguous">("global");
  const [seed, setSeed] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const sourceRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const t = useTranslations("comp.removeBg");

  function load(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result ?? "");
      const img = new Image();
      img.onload = () => {
        sourceRef.current = img;
        setSource(data);
        setMeta(`${img.naturalWidth}×${img.naturalHeight}`);
        setResult("");
        setSeed(null);
        setColor("#ffffff");
      };
      img.src = data;
    };
    reader.readAsDataURL(file);
  }

  function sampleFromEvent(event: React.MouseEvent<HTMLImageElement>) {
    const img = sourceRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || busy) return;
    if (exceedsCanvasLimit(img.naturalWidth, img.naturalHeight)) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * img.naturalWidth);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * img.naturalHeight);
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    context.drawImage(img, 0, 0);
    let pixel: Uint8ClampedArray;
    try {
      pixel = context.getImageData(x, y, 1, 1).data;
    } catch {
      return;
    }
    setColor(rgbToHex(pixel[0], pixel[1], pixel[2]));
    if (mode === "contiguous") setSeed({ x, y });
  }

  function process() {
    const img = sourceRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    if (exceedsCanvasLimit(img.naturalWidth, img.naturalHeight)) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
    let imageData: ImageData;
    try {
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    } catch {
      return;
    }
    const { data, width, height } = imageData;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const threshold = (tolerance / 100) * MAX_DIST;

    const matches = (i: number) => {
      const dr = data[i] - r;
      const dg = data[i + 1] - g;
      const db = data[i + 2] - b;
      return dr * dr + dg * dg + db * db <= threshold * threshold;
    };

    if (mode === "contiguous" && seed) {
      const size = width * height;
      const visited = new Uint8Array(size);
      const stack = new Uint32Array(size);
      let top = 0;
      const start = seed.y * width + seed.x;
      if (start >= 0 && start < size) {
        visited[start] = 1;
        stack[top++] = start;
      }
      const push = (i: number) => {
        if (!visited[i]) {
          visited[i] = 1;
          stack[top++] = i;
        }
      };
      while (top > 0) {
        const idx = stack[--top];
        const pixel = idx * 4;
        if (!matches(pixel)) continue;
        data[pixel + 3] = 0;
        const x = idx % width;
        const y = Math.floor(idx / width);
        if (x > 0) push(idx - 1);
        if (x < width - 1) push(idx + 1);
        if (y > 0) push(idx - width);
        if (y < height - 1) push(idx + width);
      }
    } else {
      for (let i = 0; i < data.length; i += 4) {
        if (matches(i)) data[i + 3] = 0;
      }
    }

    context.putImageData(imageData, 0, 0);
    setResult(canvas.toDataURL("image/png"));
  }

  useEffect(() => {
    if (!source) return;
    setBusy(true);
    const timer = window.setTimeout(() => {
      try {
        process();
      } finally {
        setBusy(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, color, tolerance, mode, seed]);

  function clear() {
    setSource("");
    setMeta("");
    setResult("");
    setSeed(null);
    setColor("#ffffff");
  }

  const modeButton = (id: "global" | "contiguous", label: string) => (
    <button
      type="button"
      onClick={() => setMode(id)}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
        mode === id
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-surface text-muted hover:border-strong"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-md">
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface text-center transition-colors hover:border-accent">
          <span className="px-4 py-6 text-sm text-muted">
            {source ? t("chosen") : t("uploadHint")}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) load(file);
            }}
          />
        </label>
      </div>

      {source ? (
        <div className="mt-6 max-w-md">
          <div className="overflow-hidden rounded-lg border border-border">
            <img
              src={source}
              alt={t("previewAlt")}
              onClick={sampleFromEvent}
              className="max-h-80 w-full cursor-crosshair object-contain"
            />
          </div>
          {meta ? (
            <p className="mt-2 text-xs tabular-nums text-faint">{meta}</p>
          ) : null}
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {mode === "contiguous" ? t("seedHint") : t("clickHint")}
          </p>

          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor="rbg-color"
                className="block text-xs font-medium text-muted"
              >
                {t("colorLabel")}
              </label>
              <input
                id="rbg-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="mt-2 h-10 w-16 cursor-pointer rounded-lg border border-border bg-bg p-1"
              />
            </div>
            <div className="min-w-48">
              <label
                htmlFor="rbg-tolerance"
                className="block text-xs font-medium text-muted"
              >
                {t("toleranceLabel", { value: tolerance })}
              </label>
              <input
                id="rbg-tolerance"
                type="range"
                min={1}
                max={100}
                value={tolerance}
                onChange={(event) => setTolerance(Number(event.target.value))}
                className="mt-2 w-full accent-accent"
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="block text-xs font-medium text-muted">
              {t("modeLabel")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {modeButton("global", t("modeGlobal"))}
              {modeButton("contiguous", t("modeContiguous"))}
            </div>
          </div>

          <div className="mt-6">
            {result ? (
              <div
                className="rounded-lg border border-border p-2 bg-bg"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%)",
                  backgroundSize: "14px 14px",
                }}
              >
                <img
                  src={result}
                  alt={t("resultAlt")}
                  className="mx-auto block max-h-96 object-contain"
                />
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
                {t("empty")}
              </p>
            )}
          </div>

          {result ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={result}
                download="remove-bg.png"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
              >
                {t("download")}
              </a>
              <button
                type="button"
                onClick={clear}
                className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
              >
                {t("clear")}
              </button>
            </div>
          ) : null}

          {busy ? (
            <p className="mt-3 text-xs text-muted">{t("working")}</p>
          ) : null}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}