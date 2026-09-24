"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { showToast } from "@/lib/toast";
import { createSampleImageFile } from "@/lib/sampleImage";

function kb(bytes: number): string {
  return (bytes / 1024).toFixed(1);
}

export default function ImageCompressor() {
  const t = useTranslations("comp.imageCompressor");
  const urlsRef = useRef<string[]>([]);
  const resultRef = useRef<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function release(url: string | null) {
    if (!url) return;
    URL.revokeObjectURL(url);
    urlsRef.current = urlsRef.current.filter((item) => item !== url);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files && event.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError(t("error"));
      return;
    }
    setError(null);
    release(previewUrl);
    release(resultRef.current);
    resultRef.current = null;
    setResultUrl(null);
    setResultSize(0);
    setNatural({ w: 0, h: 0 });
    const url = URL.createObjectURL(selected);
    urlsRef.current.push(url);
    setFile(selected);
    setPreviewUrl(url);
    const probe = new Image();
    probe.onload = () => setNatural({ w: probe.naturalWidth, h: probe.naturalHeight });
    probe.onerror = () => setError(t("error"));
    probe.src = url;
  }

  useEffect(() => {
    if (!file || !previewUrl || natural.w === 0) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      const limit = parseInt(maxWidth, 10);
      if (Number.isFinite(limit) && limit > 0 && limit < w) {
        h = Math.max(1, Math.round((h * limit) / w));
        w = limit;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const keepAlpha = file.type === "image/png";
      const type = keepAlpha ? "image/webp" : "image/jpeg";
      if (!keepAlpha) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (cancelled || !blob) return;
          const next = URL.createObjectURL(blob);
          urlsRef.current.push(next);
          release(resultRef.current);
          resultRef.current = next;
          setResultUrl(next);
          setResultSize(blob.size);
        },
        type,
        quality
      );
    };
    img.onerror = () => {
      if (!cancelled) setError(t("error"));
    };
    img.src = previewUrl;
    return () => {
      cancelled = true;
    };
  }, [file, previewUrl, natural, quality, maxWidth, t]);

  const saved =
    file && resultSize > 0
      ? Math.max(0, Math.round((1 - resultSize / file.size) * 100))
      : 0;
  const baseName = file ? file.name.replace(/\.[^.]+$/, "") : "image";
  const outExt = file && file.type === "image/png" ? "webp" : "jpg";

  return (
    <div>
      <label htmlFor="sikistirici-dosya" className="block text-sm font-medium text-text">
        {t("upload")}
      </label>
      <input
        id="sikistirici-dosya"
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

      <div className="mt-5">
        <label
          htmlFor="sikistirici-kalite"
          className="flex items-baseline justify-between text-sm font-medium text-text"
        >
          {t("quality")}
          <span className="text-sm font-semibold tabular-nums text-accent">
            {Math.round(quality * 100)}%
          </span>
        </label>
        <input
          id="sikistirici-kalite"
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={quality}
          onChange={(event) => setQuality(Number(event.target.value))}
          className="mt-3 w-full accent-accent"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="sikistirici-genislik" className="block text-sm font-medium text-text">
          {t("maxWidth")}
        </label>
        <input
          id="sikistirici-genislik"
          type="number"
          min={1}
          value={maxWidth}
          onChange={(event) => setMaxWidth(event.target.value)}
          placeholder="1920"
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
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
          <img
            src={previewUrl}
            alt=""
            className="max-h-56 w-full object-contain"
          />
        </div>
      ) : null}

      {file && resultUrl ? (
        <>
          <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("originalSize")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight text-text">
                {kb(file.size)} KB
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("newSize")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight text-text">
                {kb(resultSize)} KB
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("saved")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight text-accent">
                {saved}%
              </dd>
            </div>
          </dl>
          <a
            href={resultUrl}
            download={`${baseName}-compressed.${outExt}`}
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
