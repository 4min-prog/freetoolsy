"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { useTranslations } from "next-intl";

type Sample = { hex: string; r: number; g: number; b: number };

function toHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function ResimdenRenkSecici() {
  const t = useTranslations("comp.resimdenRenkSecici");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hover, setHover] = useState<Sample | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = urlRef.current;
    return () => {
      if (url) URL.revokeObjectURL(url);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files && event.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError(t("error"));
      return;
    }
    setError(null);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(selected);
    urlRef.current = url;
    setPreviewUrl(url);
    setHover(null);
    setPicked([]);
    setCopiedIndex(null);
  }

  useEffect(() => {
    if (!previewUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0);
    };
    img.onerror = () => setError(t("error"));
    img.src = previewUrl;
  }, [previewUrl, t]);

  function sampleAt(event: MouseEvent<HTMLCanvasElement>): Sample | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const x = Math.min(
      canvas.width - 1,
      Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width))
    );
    const y = Math.min(
      canvas.height - 1,
      Math.max(0, Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height))
    );
    const data = ctx.getImageData(x, y, 1, 1).data;
    return { hex: toHex(data[0], data[1], data[2]), r: data[0], g: data[1], b: data[2] };
  }

  function handleMove(event: MouseEvent<HTMLCanvasElement>) {
    const sample = sampleAt(event);
    if (sample) setHover(sample);
  }

  function handleClick(event: MouseEvent<HTMLCanvasElement>) {
    const sample = sampleAt(event);
    if (!sample) return;
    setHover(sample);
    setPicked((current) => [...current, sample.hex]);
  }

  function handleCopy(hex: string, index: number) {
    navigator.clipboard
      .writeText(hex)
      .then(() => {
        setCopiedIndex(index);
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopiedIndex(null), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <label htmlFor="renk-dosya" className="block text-sm font-medium text-text">
        {t("upload")}
      </label>
      <input
        id="renk-dosya"
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface file:px-3 file:py-2 file:text-sm file:font-medium file:text-text hover:file:border-strong"
      />

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text"
        >
          {error}
        </p>
      ) : null}

      {previewUrl ? (
        <>
          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-surface">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMove}
              onClick={handleClick}
              className="block max-h-80 w-full cursor-crosshair object-contain"
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">{t("hint")}</p>
        </>
      ) : null}

      <div className="mt-5 flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3">
        <div
          aria-hidden="true"
          className="h-12 w-12 shrink-0 rounded-lg border border-strong"
          style={{ backgroundColor: hover ? hover.hex : "transparent" }}
        />
        <div className="min-w-0">
          <p className="text-xs text-muted">{t("current")}</p>
          {hover ? (
            <p className="mt-0.5 font-mono text-sm tabular-nums text-text">
              {t("hex")}: {hover.hex.toUpperCase()} · {t("rgb")}:
              {" "}
              {hover.r}, {hover.g}, {hover.b}
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-faint">—</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-text">{t("picked")}</h3>
        {picked.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setPicked([]);
              setCopiedIndex(null);
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {t("clear")}
          </button>
        ) : null}
      </div>

      {picked.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-border bg-bg px-5 py-5 text-center">
          <p className="text-sm text-muted">{t("empty")}</p>
        </div>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {picked.map((hex, index) => (
            <li
              key={hex + index}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2"
            >
              <span
                aria-hidden="true"
                className="h-6 w-6 rounded-lg border border-strong"
                style={{ backgroundColor: hex }}
              />
              <code className="font-mono text-xs tabular-nums text-text">
                {hex.toUpperCase()}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(hex, index)}
                className="rounded-md border border-border bg-bg px-2 py-1 text-[11px] font-medium text-muted transition-colors hover:border-strong hover:text-text"
              >
                {copiedIndex === index ? t("copied") : t("copy")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
