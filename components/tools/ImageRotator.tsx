"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

interface Transform {
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function applyTransform(
  source: string,
  transform: Transform,
  onDone: (dataUrl: string) => void
) {
  const image = new Image();
  image.onload = () => {
    const { rotation, flipH, flipV } = transform;
    const swap = rotation === 90 || rotation === 270;
    const width = swap ? image.height : image.width;
    const height = swap ? image.width : image.height;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    onDone(canvas.toDataURL("image/png"));
  };
  image.src = source;
}

export default function ImageRotator() {
  const [source, setSource] = useState("");
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("image");
  const [transform, setTransform] = useState<Transform>({
    rotation: 0,
    flipH: false,
    flipV: false,
  });
  const t = useTranslations("comp.imageRotator");

  const onFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    const dataUrl = await readFile(file);
    setSource(dataUrl);
    setName(file.name.replace(/\.[^.]+$/, "") || "image");
    setTransform({ rotation: 0, flipH: false, flipV: false });
    setPreview(dataUrl);
  }, []);

  const apply = useCallback(
    (patch: Partial<Transform>) => {
      if (!source) return;
      const next = { ...transform, ...patch };
      setTransform(next);
      applyTransform(source, next, (dataUrl) => setPreview(dataUrl));
    },
    [source, transform]
  );

  const reset = useCallback(() => {
    if (!source) return;
    setTransform({ rotation: 0, flipH: false, flipV: false });
    setPreview(source);
  }, [source]);

  const download = useCallback(() => {
    if (!preview) return;
    const link = document.createElement("a");
    link.href = preview;
    link.download = `${name}-${transform.rotation}-${transform.flipH ? "mirror" : ""}.png`;
    link.click();
  }, [preview, name, transform]);

  const buttonClass =
    "rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text";

  return (
    <div>
      <label
        htmlFor="imgrot-file"
        className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted transition-colors hover:border-accent"
      >
        <input
          id="imgrot-file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
        {t("upload")}
      </label>

      {source && (
        <div className="mt-6">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <img
              src={preview}
              alt=""
              className="mx-auto max-h-80 max-w-full object-contain"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => apply({ rotation: 270 })} className={buttonClass}>
              {t("rotateLeft")}
            </button>
            <button type="button" onClick={() => apply({ rotation: 180 })} className={buttonClass}>
              {t("rotate180")}
            </button>
            <button type="button" onClick={() => apply({ rotation: 90 })} className={buttonClass}>
              {t("rotateRight")}
            </button>
            <button type="button" onClick={() => apply({ flipH: !transform.flipH })} className={buttonClass}>
              {t("flipH")}
            </button>
            <button type="button" onClick={() => apply({ flipV: !transform.flipV })} className={buttonClass}>
              {t("flipV")}
            </button>
            <button type="button" onClick={reset} className={buttonClass}>
              {t("reset")}
            </button>
          </div>

          <button
            type="button"
            onClick={download}
            className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
          >
            {t("download")}
          </button>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}