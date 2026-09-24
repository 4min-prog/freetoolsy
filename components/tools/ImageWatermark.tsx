"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function ImageWatermark() {
  const [source, setSource] = useState("");
  const [watermark, setWatermark] = useState("");
  const [position, setPosition] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center"
  >("bottom-right");
  const [opacity, setOpacity] = useState("70");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const baseRef = useRef<HTMLImageElement | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);
  const t = useTranslations("comp.imageWatermark");

  function handleBase(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSource(String(reader.result ?? ""));
      setOutput("");
      setError("");
    };
    reader.readAsDataURL(file);
  }

  function handleOverlay(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWatermark(String(reader.result ?? ""));
      setOutput("");
      setError("");
    };
    reader.readAsDataURL(file);
  }

  function apply() {
    setError("");
    setOutput("");
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (!base || !overlay) {
      setError(t("missingImages"));
      return;
    }
    const alpha = Number(opacity);
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 100) {
      setError(t("invalidOpacity"));
      return;
    }
    setBusy(true);
    setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = base.naturalWidth;
        canvas.height = base.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError(t("error"));
          setBusy(false);
          return;
        }
        ctx.drawImage(base, 0, 0);
        const pad = Math.round(base.naturalWidth * 0.05);
        const maxW = Math.max(Math.round(base.naturalWidth * 0.35), 1);
        const maxH = Math.max(Math.round(base.naturalHeight * 0.35), 1);
        const ratio = Math.min(maxW / overlay.naturalWidth, maxH / overlay.naturalHeight, 1);
        const w = Math.max(Math.round(overlay.naturalWidth * ratio), 1);
        const h = Math.max(Math.round(overlay.naturalHeight * ratio), 1);
        let x = pad;
        let y = pad;
        if (position === "bottom-right") {
          x = base.naturalWidth - w - pad;
          y = base.naturalHeight - h - pad;
        } else if (position === "bottom-left") {
          y = base.naturalHeight - h - pad;
        } else if (position === "top-right") {
          x = base.naturalWidth - w - pad;
        } else if (position === "center") {
          x = (base.naturalWidth - w) / 2;
          y = (base.naturalHeight - h) / 2;
        }
        ctx.globalAlpha = alpha / 100;
        ctx.drawImage(overlay, x, y, w, h);
        ctx.globalAlpha = 1;
        setOutput(canvas.toDataURL("image/png"));
      } catch {
        setError(t("error"));
      } finally {
        setBusy(false);
      }
    }, 0);
  }

  function download() {
    if (!output) return;
    const link = document.createElement("a");
    link.href = output;
    link.download = "watermarked.png";
    link.click();
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-text">{t("baseLabel")}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleBase}
            className="mt-2 block w-full cursor-pointer rounded-lg border border-border bg-bg px-3 py-2 text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-text">{t("overlayLabel")}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleOverlay}
            className="mt-2 block w-full cursor-pointer rounded-lg border border-border bg-bg px-3 py-2 text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-accent"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wm-position" className="block text-sm font-medium text-text">
            {t("positionLabel")}
          </label>
          <select
            id="wm-position"
            value={position}
            onChange={(event) => setPosition(event.target.value as typeof position)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="bottom-right">{t("posBottomRight")}</option>
            <option value="bottom-left">{t("posBottomLeft")}</option>
            <option value="top-right">{t("posTopRight")}</option>
            <option value="top-left">{t("posTopLeft")}</option>
            <option value="center">{t("posCenter")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="wm-opacity" className="block text-sm font-medium text-text">
            {t("opacityLabel")} %{opacity}
          </label>
          <input
            id="wm-opacity"
            type="range"
            min={5}
            max={100}
            step={5}
            value={opacity}
            onChange={(event) => setOpacity(event.target.value)}
            className="mt-3 w-full accent-accent"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={apply}
          disabled={busy || !source || !watermark}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? t("working") : t("apply")}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {source ? (
        <img
          ref={baseRef}
          src={source}
          alt={t("altBase")}
          className="hidden"
          draggable={false}
        />
      ) : null}
      {watermark ? (
        <img
          ref={overlayRef}
          src={watermark}
          alt={t("altOverlay")}
          className="hidden"
          draggable={false}
        />
      ) : null}

      {output ? (
        <div className="mt-5">
          <div className="overflow-hidden rounded-lg border border-border bg-bg">
            <img src={output} alt={t("altResult")} className="block h-auto max-w-full" />
          </div>
          <button
            type="button"
            onClick={download}
            className="mt-3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {t("download")}
          </button>
        </div>
      ) : null}
    </div>
  );
}