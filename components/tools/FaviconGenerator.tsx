"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type IconSize = 16 | 24 | 32 | 48 | 64;

const SIZES: IconSize[] = [16, 24, 32, 48, 64];


function buildIco(pngBytes: Uint8Array): Uint8Array {
  const header = new Uint8Array(22);
  const dv = new DataView(header.buffer);
  dv.setUint16(0, 0, true);
  dv.setUint16(2, 1, true);
  dv.setUint16(4, 1, true);
  dv.setUint8(6, pngBytes[16] === 0 ? 0 : pngBytes[16]);
  dv.setUint8(7, pngBytes[20] === 0 ? 0 : pngBytes[20]);
  dv.setUint8(8, 0);
  dv.setUint8(9, 0);
  dv.setUint16(10, 1, true);
  dv.setUint16(12, 32, true);
  dv.setUint32(14, pngBytes.length, true);
  dv.setUint32(18, 22, true);
  const ico = new Uint8Array(22 + pngBytes.length);
  ico.set(header, 0);
  ico.set(pngBytes, 22);
  return ico;
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function FaviconGenerator() {
  const [foreground, setForeground] = useState("#FFFFFF");
  const [background, setBackground] = useState("#2563EB");
  const [text, setText] = useState("FT");
  const [size, setSize] = useState<IconSize>(32);
  const [transparent, setTransparent] = useState(false);
  const [pngUrl, setPngUrl] = useState("");
  const [icoUrl, setIcoUrl] = useState("");
  const [icoBase64, setIcoBase64] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const t = useTranslations("comp.faviconGenerator");

  const sizeLabel = useMemo(() => `${size}x${size}`, [size]);

  function generate() {
    setError("");
    setPngUrl("");
    setIcoUrl("");
    setIcoBase64("");
    const label = text.trim() || "?";
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError(t("error"));
      return;
    }
    if (!transparent) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, size, size);
    }
    ctx.fillStyle = foreground;
    const fontSize = Math.max(Math.round(size * 0.6), 6);
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, size / 2, size / 2 + fontSize * 0.08, size * 0.9);

    const pngData = canvas.toDataURL("image/png");
    setPngUrl(pngData);
    setBusy(true);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError(t("error"));
          setBusy(false);
          return;
        }
        blob
          .arrayBuffer()
          .then((buffer) => {
            const png = new Uint8Array(buffer);
            const ico = buildIco(png);
            const icoData = toBase64(ico);
            setIcoBase64(icoData);
            setIcoUrl(`data:image/x-icon;base64,${icoData}`);
          })
          .catch(() => setError(t("error")))
          .finally(() => setBusy(false));
      },
      "image/png"
    );
  }

  function download(url: string, filename: string) {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }

  function handleCopy() {
    if (!icoBase64) return;
    navigator.clipboard
      .writeText(icoBase64)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="fg-color" className="block text-sm font-medium text-text">
              {t("foregroundLabel")}
            </label>
            <input
              id="fg-color"
              type="color"
              value={foreground}
              onChange={(event) => setForeground(event.target.value)}
              className="mt-2 h-10 w-full cursor-pointer rounded-lg border border-border bg-bg"
            />
          </div>
          <div>
            <label htmlFor="bg-color" className="block text-sm font-medium text-text">
              {t("backgroundLabel")}
            </label>
            <input
              id="bg-color"
              type="color"
              value={background}
              disabled={transparent}
              onChange={(event) => setBackground(event.target.value)}
              className={`mt-2 h-10 w-full cursor-pointer rounded-lg border border-border bg-bg ${
                transparent ? "opacity-40" : ""
              }`}
            />
          </div>
          <div>
            <label htmlFor="fav-text" className="block text-sm font-medium text-text">
              {t("textLabel")}
            </label>
            <input
              id="fav-text"
              type="text"
              maxLength={2}
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>
        <div>
          <label htmlFor="fav-size" className="block text-sm font-medium text-text">
            {t("sizeLabel")}
          </label>
          <select
            id="fav-size"
            value={size}
            onChange={(event) => setSize(Number(event.target.value) as IconSize)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {SIZES.map((item) => (
              <option key={item} value={item}>
                {item}x{item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={transparent}
          onChange={(event) => setTransparent(event.target.checked)}
          className="accent-accent"
        />
        {t("transparentLabel")}
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? t("working") : t("generate")}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {pngUrl ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-lg border border-border bg-bg p-4">
            <span className="text-xs font-medium text-muted">{sizeLabel}</span>
            <img
              src={pngUrl}
              alt={t("altPng")}
              className="mt-3 h-16 w-16 rounded border border-border"
              style={{ imageRendering: "pixelated" }}
            />
            <button
              type="button"
              onClick={() => download(pngUrl, `favicon-${size}.png`)}
              className="mt-3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {t("downloadPng")}
            </button>
          </div>
          <div className="flex flex-col items-center rounded-lg border border-border bg-bg p-4">
            <span className="text-xs font-medium text-muted">{t("icoLabel")}</span>
            {icoUrl ? (
              <img
                src={icoUrl}
                alt={t("altIco")}
                className="mt-3 h-16 w-16 rounded border border-border"
                style={{ imageRendering: "pixelated" }}
              />
            ) : null}
            <div className="mt-3 flex gap-2">
              {icoUrl ? (
                <button
                  type="button"
                  onClick={() => download(icoUrl, "favicon.ico")}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
                >
                  {t("downloadIco")}
                </button>
              ) : null}
              {icoBase64 ? (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
                >
                  {copied ? t("copied") : t("copyBase64")}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
