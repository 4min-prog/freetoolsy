"use client";

import { exceedsCanvasLimit } from "@/lib/canvasLimit";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function ImageFlipper() {
  const [data, setData] = useState<string | null>(null);
  const [meta, setMeta] = useState("");
  const [horizontal, setHorizontal] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("comp.imageFlipper");

  function pick(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      const img = new Image();
      img.onload = () => {
        setMeta(`${img.naturalWidth}×${img.naturalHeight}`);
        setData(url);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }

  function flip() {
    if (!data) return;
    const img = new Image();
    img.src = data;
    img.decode().then(() => {
      const canvas = document.createElement("canvas");
      if (exceedsCanvasLimit(img.naturalWidth, img.naturalHeight)) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.translate(horizontal ? img.naturalWidth : 0, horizontal ? 0 : img.naturalHeight);
      ctx.scale(horizontal ? -1 : 1, horizontal ? 1 : -1);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = horizontal ? "flipped-horizontal.png" : "flipped-vertical.png";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-strong"
      >
        {t(data ? "change" : "pick")}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) pick(file);
        }}
      />

      {data ? (
        <div className="mt-6 max-w-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data}
            alt={t("preview")}
            className="max-h-64 rounded-lg border border-border object-contain"
          />
          <p className="mt-2 text-xs tabular-nums text-faint">
            {meta} · {t("axis", { axis: horizontal ? "⇔" : "⇕" })}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setHorizontal(true)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                horizontal
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:border-strong"
              }`}
            >
              {t("horizontal")}
            </button>
            <button
              type="button"
              onClick={() => setHorizontal(false)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                !horizontal
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:border-strong"
              }`}
            >
              {t("vertical")}
            </button>
          </div>

          <button
            type="button"
            onClick={flip}
            className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("flip")}
          </button>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}