"use client";

import SampleButton from "@/components/SampleButton";
import { showToast } from "@/lib/toast";
import { createSampleImageFile } from "@/lib/sampleImage";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";

function kb(bytes: number): string {
  return (bytes / 1024).toFixed(1);
}

export default function ResimdenBase64() {
  const t = useTranslations("comp.resimdenBase64");
  const [dataUrl, setDataUrl] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
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
    setDataUrl("");
    setFileSize(selected.size);
    const reader = new FileReader();
    reader.onload = () => {
      setDataUrl(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => setError(t("error"));
    reader.readAsDataURL(selected);
  }

  function handleCopy() {
    if (!dataUrl) return;
    navigator.clipboard
      .writeText(dataUrl)
      .then(() => {
        setCopied(true); showToast();
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <label htmlFor="base64-dosya" className="block text-sm font-medium text-text">
        {t("upload")}
      </label>
      <input
        id="base64-dosya"
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

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text"
        >
          {error}
        </p>
      ) : null}

      {dataUrl ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("fileSize")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight text-text">
                {kb(fileSize)} KB
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("dataLength")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight text-text">
                {dataUrl.length}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <label htmlFor="base64-sonuc" className="block text-sm font-medium text-text">
              {t("result")}
            </label>
            <textarea
              id="base64-sonuc"
              readOnly
              rows={8}
              value={dataUrl}
              className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
