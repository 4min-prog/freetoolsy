"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function MetaTagUretici() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"website" | "article">("website");
  const [image, setImage] = useState("");
  const [twitter, setTwitter] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.metaTagUretici");

  const host = useMemo(() => {
    const raw = url.trim();
    if (!raw) return "";
    try {
      return new URL(raw).hostname.replace(/^www\./, "");
    } catch {
      return raw.replace(/^https?:\/\//, "").split("/")[0];
    }
  }, [url]);

  const snippet = useMemo(() => {
    const lines: string[] = [];
    if (title) lines.push(`<title>${title}</title>`);
    if (description) {
      lines.push(`<meta name="description" content="${description}" />`);
    }
    if (title) lines.push(`<meta property="og:title" content="${title}" />`);
    if (description) {
      lines.push(`<meta property="og:description" content="${description}" />`);
    }
    if (url) {
      lines.push(`<meta property="og:url" content="${url}" />`);
      lines.push(`<meta property="og:type" content="${type}" />`);
    }
    if (image) lines.push(`<meta property="og:image" content="${image}" />`);
    if (title || description || image) {
      lines.push(
        `<meta name="twitter:card" content="${
          image ? "summary_large_image" : "summary"
        }" />`
      );
      if (title) lines.push(`<meta name="twitter:title" content="${title}" />`);
      if (description) {
        lines.push(
          `<meta name="twitter:description" content="${description}" />`
        );
      }
      if (image) lines.push(`<meta name="twitter:image" content="${image}" />`);
    }
    if (twitter.trim()) {
      const handle = twitter.trim().startsWith("@")
        ? twitter.trim()
        : "@" + twitter.trim();
      lines.push(`<meta name="twitter:site" content="${handle}" />`);
    }
    return lines.join("\n");
  }, [title, description, url, type, image, twitter]);

  function handleCopy() {
    if (!snippet) return;
    navigator.clipboard
      .writeText(snippet)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="meta-baslik" className="block text-sm font-medium text-text">
            {t("titleLabel")}
          </label>
          <input
            id="meta-baslik"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("titlePlaceholder")}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="meta-aciklama" className="block text-sm font-medium text-text">
            {t("descLabel")}
          </label>
          <textarea
            id="meta-aciklama"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder={t("descPlaceholder")}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="meta-url" className="block text-sm font-medium text-text">
            {t("urlLabel")}
          </label>
          <input
            id="meta-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder={t("urlPlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="meta-tip" className="block text-sm font-medium text-text">
            {t("typeLabel")}
          </label>
          <select
            id="meta-tip"
            value={type}
            onChange={(event) => setType(event.target.value as "website" | "article")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="website">{t("typeWebsite")}</option>
            <option value="article">{t("typeArticle")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="meta-gorsel" className="block text-sm font-medium text-text">
            {t("imageLabel")}
          </label>
          <input
            id="meta-gorsel"
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder={t("imagePlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="meta-twitter" className="block text-sm font-medium text-text">
            {t("handleLabel")}
          </label>
          <input
            id="meta-twitter"
            type="text"
            value={twitter}
            onChange={(event) => setTwitter(event.target.value)}
            placeholder={t("handlePlaceholder")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted">{t("outputLabel")}</p>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!snippet}
          className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <textarea
        readOnly
        value={snippet}
        rows={10}
        placeholder={t("outputPlaceholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <p className="mt-6 text-xs font-medium text-muted">{t("previewLabel")}</p>
      <div className="mt-2 rounded-xl border border-border bg-surface p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 shrink-0 rounded-full border border-border bg-surface-2" />
          <span className="min-w-0 truncate text-xs text-faint">
            {host || t("urlPlaceholder")}
          </span>
        </div>
        <p className="mt-2 text-lg leading-snug text-accent">
          {title || t("titlePlaceholder")}
        </p>
        <p className="text-xs leading-snug text-muted">
          {host || t("urlPlaceholder")}
        </p>
        <p className="mt-1 text-sm leading-snug text-text">
          {description || t("descPlaceholder")}
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
