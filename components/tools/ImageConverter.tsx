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

const FORMATS = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

export default function ImageConverter() {
  const t = useTranslations("comp.imageConverter");
  const urlsRef = useRef<string[]>([]);
  const outRef = useRef<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.85);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
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
    release(outRef.current);
    outRef.current = null;
    setOutUrl(null);
    setOutSize(0);
    const url = URL.createObjectURL(selected);
    urlsRef.current.push(url);
    setFile(selected);
    setPreviewUrl(url);
  }

  useEffect(() => {
    if (!file || !previewUrl) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const useQuality = format !== "image/png";
      canvas.toBlob(
        (blob) => {
          if (cancelled || !blob) return;
          const next = URL.createObjectURL(blob);
          urlsRef.current.push(next);
          release(outRef.current);
          outRef.current = next;
          setOutUrl(next);
          setOutSize(blob.size);
        },
        format,
        useQuality ? quality : undefined
      );
    };
    img.onerror = () => {
      if (!cancelled) setError(t("error"));
    };
    img.src = previewUrl;
    return () => {
      cancelled = true;
    };
  }, [file, previewUrl, format, quality, t]);

  const current = FORMATS.find((item) => item.value === format) || FORMATS[0];
  const baseName = file ? file.name.replace(/\.[^.]+$/, "") : "image";

  return (
    <div>
      <label htmlFor="donustur-dosya" className="block text-sm font-medium text-text">
        {t("upload")}
      </label>
      <input
        id="donustur-dosya"
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
        <label htmlFor="donustur-format" className="block text-sm font-medium text-text">
          {t("format")}
        </label>
        <select
          id="donustur-format"
          value={format}
          onChange={(event) => setFormat(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:w-auto"
        >
          {FORMATS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor="donustur-kalite"
          className="flex items-baseline justify-between text-sm font-medium text-text"
        >
          {t("quality")}
          <span className="text-sm font-semibold tabular-nums text-accent">
            {Math.round(quality * 100)}%
          </span>
        </label>
        <input
          id="donustur-kalite"
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={quality}
          disabled={format === "image/png"}
          onChange={(event) => setQuality(Number(event.target.value))}
          className="mt-3 w-full accent-accent disabled:opacity-50"
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
          <img src={previewUrl} alt="" className="max-h-56 w-full object-contain" />
        </div>
      ) : null}

      {file && outUrl ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("originalSize")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight text-text">
                {kb(file.size)} KB
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("newSize")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight text-text">
                {kb(outSize)} KB
              </dd>
            </div>
          </dl>
          <a
            href={outUrl}
            download={`${baseName}.${current.ext}`}
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
