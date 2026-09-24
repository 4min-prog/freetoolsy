"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type CropBox = { x: number; y: number; width: number; height: number };

export default function ImageCrop() {
  const [source, setSource] = useState("");
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<CropBox | null>(null);
  const [dragging, setDragging] = useState(false);
  const [exportUrl, setExportUrl] = useState("");
  const [error, setError] = useState("");
  const started = useRef<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const t = useTranslations("comp.imageCrop");

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSource(String(reader.result ?? ""));
      setCrop(null);
      setExportUrl("");
      setError("");
    };
    reader.readAsDataURL(file);
  }

  function handleLoaded() {
    const image = imageRef.current;
    if (image) setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
  }

  function displayToImage(clientX: number, clientY: number): { x: number; y: number } {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const scaleX = imageSize.width / rect.width;
    const scaleY = imageSize.height / rect.height;
    return {
      x: Math.min(Math.max((clientX - rect.left) * scaleX, 0), imageSize.width),
      y: Math.min(Math.max((clientY - rect.top) * scaleY, 0), imageSize.height),
    };
  }

  function handleMouseDown(event: React.MouseEvent<HTMLImageElement>) {
    event.preventDefault();
    const point = displayToImage(event.clientX, event.clientY);
    started.current = point;
    setDragging(true);
  }

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLImageElement>) => {
      if (!dragging || !started.current) return;
      const point = displayToImage(event.clientX, event.clientY);
      const start = started.current;
      const x = Math.min(start.x, point.x);
      const y = Math.min(start.y, point.y);
      const width = Math.abs(point.x - start.x);
      const height = Math.abs(point.y - start.y);
      setCrop({ x, y, width, height });
    },
    [dragging, imageSize]
  );

  function handleMouseUp() {
    setDragging(false);
    started.current = null;
  }

  function reset() {
    setCrop(null);
    setExportUrl("");
    setError("");
  }

  function cropImage() {
    setError("");
    setExportUrl("");
    if (!crop || crop.width < 1 || crop.height < 1 || !source) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(crop.width);
    canvas.height = Math.round(crop.height);
    const ctx = canvas.getContext("2d");
    const image = imageRef.current;
    if (!ctx || !image) {
      setError(t("error"));
      return;
    }
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    setExportUrl(canvas.toDataURL("image/png"));
  }

  function download() {
    if (!exportUrl) return;
    const link = document.createElement("a");
    link.href = exportUrl;
    link.download = "cropped.png";
    link.click();
  }

  return (
    <div>
      <label className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bg px-4 py-8 text-center">
        <span className="text-sm font-medium text-muted">{source ? t("replace") : t("dropHint")}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="mt-3 block w-full max-w-xs cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-accent"
        />
      </label>

      {source ? (
        <div className="mt-4">
          <p className="text-xs text-muted">{t("tooltip")}</p>
          <div className="mt-2 overflow-auto rounded-lg border border-border bg-bg">
            <img
              ref={imageRef}
              src={source}
              alt={t("altImage")}
              onLoad={handleLoaded}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              draggable={false}
              className="block max-h-[480px] w-full cursor-crosshair select-none object-contain"
            />
          </div>
          {crop ? (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="tabular-nums">
                {t("size", {
                  width: Math.round(crop.width),
                  height: Math.round(crop.height),
                })}
              </span>
              <button
                type="button"
                onClick={cropImage}
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
              >
                {t("crop")}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
              >
                {t("reset")}
              </button>
            </div>
          ) : null}
          <DialogImagePreview crop={crop} exportUrl={exportUrl} onDownload={download} t={t} />
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
    </div>
  );
}

function DialogImagePreview(props: {
  crop: CropBox | null;
  exportUrl: string;
  onDownload: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const { crop, exportUrl, onDownload, t } = props;
  if (!crop || !exportUrl) return null;
  return (
    <div className="mt-4">
      <div className="rounded-lg border border-border bg-bg p-3">
        <img
          src={exportUrl}
          alt={t("altResult")}
          className="mx-auto max-h-72 rounded border border-border"
        />
      </div>
      <button
        type="button"
        onClick={onDownload}
        className="mt-3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
      >
        {t("download")}
      </button>
    </div>
  );
}