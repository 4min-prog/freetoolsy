"use client";

import { showToast } from "@/lib/toast";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import jsQR from "jsqr";

export default function QrCodeReader() {
  const t = useTranslations("comp.qrCodeReader");
  const [dataUrl, setDataUrl] = useState("");
  const [result, setResult] = useState("");
  const [reading, setReading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function readImage(file: File) {
    const url = URL.createObjectURL(file);
    setDataUrl(url);
    setResult("");
    setCopied(false);
    setReading(true);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 800 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(image.width * scale));
      canvas.height = Math.max(1, Math.floor(image.height * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        setReading(false);
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      setResult(code ? code.data : "");
      setReading(false);
    };
    image.onerror = () => setReading(false);
    image.src = url;
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    readImage(file);
  }

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="qr-reader-file"
        className="inline-block cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("fileLabel")}
      </label>
      <input
        id="qr-reader-file"
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {dataUrl && (
        <div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="relative h-48 w-48 overflow-hidden rounded-lg border border-border bg-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt={t("imageAlt")}
                className="h-full w-full object-contain"
              />
              {reading && (
                <span className="absolute inset-0 flex items-center justify-center bg-bg/60 text-xs font-medium text-muted">
                  {t("decoding")}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setDataUrl("");
                setResult("");
                setCopied(false);
                fileRef.current?.click();
              }}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {t("replace")}
            </button>
          </div>

          <div className="mt-5">
            {!reading && result === "" ? (
              <p className="rounded-lg border border-border bg-bg p-4 text-sm text-muted">
                {t("notFound")}
              </p>
            ) : result ? (
              <div className="rounded-lg border border-border bg-bg p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-muted">{t("result")}</p>
                  <button
                    type="button"
                    onClick={copy}
                    className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-accent hover:text-accent"
                  >
                    {copied ? t("copied") : t("copy")}
                  </button>
                </div>
                <p className="mt-2 min-w-0 break-all text-sm leading-relaxed text-text">
                  {result}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}