"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const TITLE_CHAR_LIMIT = 60;
const TITLE_PX_LIMIT = 580;
const DESC_CHAR_LIMIT = 160;
const DESC_PX_LIMIT = 920;

function widthEstimate(text: string): number {
  let width = 0;
  for (const char of text) {
    if (char.toUpperCase() === char && /[A-ZW]/.test(char)) width += 11.2;
    else if (/[ijltf1.,;:']/.test(char)) width += 4.6;
    else if (/[mw@]/.test(char)) width += 11.2;
    else if (/[()FGMQS]/.test(char)) width += 10.2;
    else width += 7.4;
  }
  return width;
}

export default function TitleLengthChecker() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const t = useTranslations("comp.titleLengthChecker");

  const titleInfo = useMemo(() => {
    const chars = title.length;
    const px = Math.round(widthEstimate(title));
    const status = chars > TITLE_CHAR_LIMIT || px > TITLE_PX_LIMIT ? "over" : "ok";
    return { chars, px, status };
  }, [title]);

  const descInfo = useMemo(() => {
    const chars = description.length;
    const px = Math.round(widthEstimate(description));
    const status = chars > DESC_CHAR_LIMIT || px > DESC_PX_LIMIT ? "over" : "ok";
    return { chars, px, status };
  }, [description]);

  const statusColor: Record<string, string> = {
    ok: "text-emerald-500",
    warn: "text-amber-500",
    over: "text-danger",
  };

  return (
    <div>
      <div>
        <label htmlFor="tlc-title" className="block text-xs font-medium text-muted">
          {t("titleLabel")}
        </label>
        <input
          id="tlc-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value.slice(0, 120))}
          placeholder={t("titlePlaceholder")}
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
          <span className="tabular-nums text-muted">
            {t("titleChars", { count: titleInfo.chars })}{" "}
            <span className={statusColor[titleInfo.status]}>
              {titleInfo.chars > TITLE_CHAR_LIMIT ? t("over") : t("ok")}
            </span>
          </span>
          <span className="tabular-nums text-muted">
            {t("titleWidth", { px: titleInfo.px })}/{TITLE_PX_LIMIT}px
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full ${titleInfo.status === "over" ? "bg-danger" : "bg-emerald-500"}`}
            style={{ width: `${Math.min((titleInfo.px / TITLE_PX_LIMIT) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="tlc-desc" className="block text-xs font-medium text-muted">
          {t("descriptionLabel")}
        </label>
        <textarea
          id="tlc-desc"
          value={description}
          onChange={(event) => setDescription(event.target.value.slice(0, 320))}
          placeholder={t("descriptionPlaceholder")}
          className="mt-1 min-h-24 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
          <span className="tabular-nums text-muted">
            {t("descChars", { count: descInfo.chars })}{" "}
            <span className={statusColor[descInfo.status]}>
              {descInfo.chars > DESC_CHAR_LIMIT ? t("over") : t("ok")}
            </span>
          </span>
          <span className="tabular-nums text-muted">
            {t("descWidth", { px: descInfo.px })}/{DESC_PX_LIMIT}px
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full ${descInfo.status === "over" ? "bg-danger" : "bg-emerald-500"}`}
            style={{ width: `${Math.min((descInfo.px / DESC_PX_LIMIT) * 100, 100)}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}