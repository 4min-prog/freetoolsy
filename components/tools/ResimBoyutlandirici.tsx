"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { showToast } from "@/lib/toast";
import { createSampleImageFile } from "@/lib/sampleImage";

export default function ResimBoyutlandirici() {
  const t = useTranslations("comp.resimBoyutlandirici");
  const urlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState("png");
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = urlRef.current;
    return () => {
      if (url) URL.revokeObjectURL(url);
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
    setOutUrl(null);
    setPreviewUrl(url);
    const probe = new Image();
    probe.onload = () => {
      setNatural({ w: probe.naturalWidth, h: probe.naturalHeight });
      setWidth(String(probe.naturalWidth));
      setHeight(String(probe.naturalHeight));
    };
    probe.onerror = () => setError(t("error"));
    probe.src = url;
  }

  function handleWidth(value: string) {
    setWidth(value);
    const next = parseInt(value, 10);
    if (keepRatio && natural.w > 0 && next > 0) {
      setHeight(String(Math.max(1, Math.round((next * natural.h) / natural.w))));
    }
  }

  function handleHeight(value: string) {
    setHeight(value);
    const next = parseInt(value, 10);
    if (keepRatio && natural.h > 0 && next > 0) {
      setWidth(String(Math.max(1, Math.round((next * natural.w) / natural.h))));
    }
  }

  useEffect(() => {
    if (!previewUrl) return;
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (!(w > 0) || !(h > 0) || w > 8000 || h > 8000) {
      setOutUrl(null);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingQuality = "high";
      const mime = format === "png" ? "image/png" : "image/jpeg";
      if (mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      setOutUrl(canvas.toDataURL(mime, 0.92));
    };
    img.onerror = () => {
      if (!cancelled) setError(t("error"));
    };
    img.src = previewUrl;
    return () => {
      cancelled = true;
    };
  }, [previewUrl, width, height, format, t]);

  const outW = parseInt(width, 10);
  const outH = parseInt(height, 10);
  const valid = outW > 0 && outH > 0 && outW <= 8000 && outH <= 8000;
  const ext = format === "png" ? "png" : "jpg";

  return (
    <div>
      <label htmlFor="boyut-dosya" className="block text-sm font-medium text-text">
        {t("upload")}
      </label>
      <input
        id="boyut-dosya"
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-surface file:px-3 file:py-2 file:text-sm file:font-medium file:text-text hover:file:border-strong"
      />
      <div className="mt-3">
        <SampleButton
          onApply={() =>
            handleFile({
              target: { files: [createSampleImageFile()] },
            } as unknown as ChangeEvent<HTMLInputElement>)
          }
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="boyut-genislik" className="block text-sm font-medium text-text">
            {t("width")}
          </label>
          <input
            id="boyut-genislik"
            type="number"
            min={1}
            max={8000}
            value={width}
            onChange={(event) => handleWidth(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="boyut-yukseklik" className="block text-sm font-medium text-text">
            {t("height")}
          </label>
          <input
            id="boyut-yukseklik"
            type="number"
            min={1}
            max={8000}
            value={height}
            onChange={(event) => handleHeight(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-muted transition-colors hover:border-strong">
        <input
          type="checkbox"
          checked={keepRatio}
          onChange={(event) => setKeepRatio(event.target.checked)}
          className="h-4 w-4 rounded accent-accent"
        />
        {t("keepRatio")}
      </label>

      <div className="mt-5">
        <label htmlFor="boyut-format" className="block text-sm font-medium text-text">
          {t("format")}
        </label>
        <select
          id="boyut-format"
          value={format}
          onChange={(event) => setFormat(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-auto"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text"
        >
          {error}
        </p>
      ) : null}

      {previewUrl ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="max-h-56 w-full object-contain" />
        </div>
      ) : null}

      {natural.w > 0 ? (
        <p className="mt-4 text-sm text-muted tabular-nums">
          {t("original", { w: natural.w, h: natural.h })}
        </p>
      ) : null}

      {outUrl && valid ? (
        <>
          <p className="mt-2 text-sm font-medium text-accent tabular-nums">
            {t("output", { w: outW, h: outH })}
          </p>
          <a
            href={outUrl}
            download={`resim-${outW}x${outH}.${ext}`}
            onClick={() => showToast("download")}
            className="mt-4 block w-full rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("download")}
          </a>
        </>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
