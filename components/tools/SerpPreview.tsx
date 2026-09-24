"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const TITLE_MAX = 60;
const DESC_MAX = 160;

export default function SerpPreview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const t = useTranslations("comp.serpPreview");

  const preview = useMemo(() => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    return {
      title:
        trimmedTitle.length > TITLE_MAX
          ? trimmedTitle.slice(0, TITLE_MAX - 1) + "…"
          : trimmedTitle,
      description:
        trimmedDesc.length > DESC_MAX
          ? trimmedDesc.slice(0, DESC_MAX - 1) + "…"
          : trimmedDesc,
    };
  }, [title, description]);

  const titleOk = title.length <= TITLE_MAX;
  const descOk = description.length <= DESC_MAX;

  const inputClass =
    "mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div>
      <div>
        <label htmlFor="serp-baslik" className="block text-sm font-medium text-text">
          {t("titleLabel")}
        </label>
        <input
          id="serp-baslik"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t("titlePlaceholder")}
          className={inputClass}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <SampleButton
            onApply={() => {
              setTitle("FreetoolsY – Ücretsiz Online Araçlar");
              setDescription(
                "FreetoolsY tarayıcınızda çalışan ücretsiz online araçlar sunar. Metin, dönüştürme, hesaplama ve daha fazlası. Kayıt gerekmez, verileriniz cihazınızdan çıkmaz."
              );
            }}
          />
        </div>
        <p className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className={titleOk ? "text-success" : "text-warning"}>
            {titleOk ? t("ok") : t("over")}
          </span>
          <span className="tabular-nums text-muted">
            {t("current", { count: title.length })} ·{" "}
            {t("recommended", { max: TITLE_MAX })}
          </span>
        </p>
      </div>

      <div className="mt-5">
        <label htmlFor="serp-aciklama" className="block text-sm font-medium text-text">
          {t("descLabel")}
        </label>
        <textarea
          id="serp-aciklama"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder={t("descPlaceholder")}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <p className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className={descOk ? "text-success" : "text-warning"}>
            {descOk ? t("ok") : t("over")}
          </span>
          <span className="tabular-nums text-muted">
            {t("current", { count: description.length })} ·{" "}
            {t("recommended", { max: DESC_MAX })}
          </span>
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4 shadow-card">
        <p className="text-xs font-medium text-faint">{t("previewLabel")}</p>
        <p className="mt-3 text-lg leading-snug text-accent">
          {preview.title || t("emptyTitle")}
        </p>
        <p className="text-xs leading-snug text-muted">example.com</p>
        <p className="mt-1 text-sm leading-snug text-text">
          {preview.description || t("emptyDesc")}
        </p>
      </div>
    </div>
  );
}
