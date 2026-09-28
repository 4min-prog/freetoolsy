"use client";

import { exceedsCanvasLimit } from "@/lib/canvasLimit";
import { useRef, useState } from "react";
import type { Ref } from "react";
import { useTranslations } from "next-intl";

export default function ImageCombiner() {
  const [first, setFirst] = useState<string | null>(null);
  const [second, setSecond] = useState<string | null>(null);
  const [firstMeta, setFirstMeta] = useState<string>("");
  const [secondMeta, setSecondMeta] = useState<string>("");
  const firstRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("comp.imageCombiner");

  function loadImage(file: File, onData: (data: string) => void, onMeta: (m: string) => void) {
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result);
      const img = new Image();
      img.onload = () => {
        onMeta(`${img.naturalWidth}×${img.naturalHeight}`);
        onData(data);
      };
      img.src = data;
    };
    reader.readAsDataURL(file);
  }

  function combine() {
    if (!first || !second) return;
    const img1 = new Image();
    const img2 = new Image();
    img1.src = first;
    img2.src = second;
    Promise.all([img1.decode(), img2.decode()]).then(() => {
      const width = img1.naturalWidth + img2.naturalWidth;
      const height = Math.max(img1.naturalHeight, img2.naturalHeight);
      const canvas = document.createElement("canvas");
      if (exceedsCanvasLimit(width, height)) return;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img1, 0, 0);
      ctx.drawImage(img2, img1.naturalWidth, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "combined.png";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    });
  }

  const slot = (
    meta: string,
    onPick: () => void,
    data: string | null,
    imageRef: Ref<HTMLInputElement>,
    label: string,
    onFile: (file: File) => void
  ) => (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-bg p-4">
      {data ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data} alt={label} className="max-h-36 w-full max-w-[240px] object-contain" />
      ) : (
        <p className="text-sm text-muted">{label}</p>
      )}
      {meta ? <p className="mt-2 text-xs tabular-nums text-faint">{meta}</p> : null}
      <button
        type="button"
        onClick={onPick}
        className="mt-3 rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text transition-colors hover:border-strong"
      >
        {t(data ? "change" : "pick")}
      </button>
      <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
      }} />
    </div>
  );

  return (
    <div>
      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        {slot(firstMeta, () => firstRef.current?.click(), first, firstRef, t("firstSlot"), (f) =>
          loadImage(f, (d) => setFirst(d), setFirstMeta)
        )}
        {slot(secondMeta, () => secondRef.current?.click(), second, secondRef, t("secondSlot"), (f) =>
          loadImage(f, (d) => setSecond(d), setSecondMeta)
        )}
      </div>

      {first && second ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={combine}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("combine")}
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