"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

const EXT_TO_MIME: Record<string, string> = {
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "text/javascript",
  mjs: "text/javascript",
  json: "application/json",
  jsonld: "application/ld+json",
  xml: "application/xml",
  pdf: "application/pdf",
  zip: "application/zip",
  gz: "application/gzip",
  tar: "application/x-tar",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  txt: "text/plain",
  md: "text/markdown",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  ico: "image/x-icon",
  avif: "image/avif",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
  woft: "font/woff",
  wasm: "application/wasm",
  webmanifest: "application/manifest+json",
  apk: "application/vnd.android.package-archive",
  exe: "application/vnd.microsoft.portable-executable",
  msi: "application/x-msdownload",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  csvt: "text/csv",
  eps: "application/postscript",
  psd: "image/vnd.adobe.photoshop",
  ai: "application/postscript",
  indd: "application/x-indesign",
  sql: "application/sql",
  ts: "video/mp2t",
  m3u8: "application/x-mpegURL",
  rss: "application/rss+xml",
  atom: "application/atom+xml",
  yaml: "application/yaml",
  yml: "application/yaml",
  toml: "application/toml",
  sh: "application/x-sh",
  py: "text/x-python",
  tsx: "text/javascript",
  jsx: "text/javascript",
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  epub: "application/epub+zip",
  mobi: "application/x-mobipocket-ebook",
};

export default function MimeTypeFinder() {
  const [ext, setExt] = useState("");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.mimeTypeFinder");

  const cleanExt = useMemo(() => ext.trim().toLowerCase().replace(/^\./, ""), [ext]);
  const mime = cleanExt ? EXT_TO_MIME[cleanExt] : "";

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return Object.entries(EXT_TO_MIME)
      .filter(([, m]) => m.includes(q))
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [search]);

  async function copyValue(value: string) {
    await copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="mime-ext"
        className="block text-sm font-medium text-text"
      >
        {t("extLabel")}
      </label>
      <input
        id="mime-ext"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={ext}
        onChange={(event) => setExt(event.target.value)}
        placeholder={t("extPlaceholder")}
        className="mt-2 w-full max-w-sm rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {cleanExt.length > 0 ? (
        <div className="mt-5 max-w-md rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted">{t("resultLabel")}</p>
          {mime ? (
            <button
              type="button"
              onClick={() => copyValue(mime)}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-left font-mono text-sm text-text transition-colors hover:border-strong"
              title={t("copy")}
            >
              {mime}
            </button>
          ) : (
            <p className="mt-1.5 text-sm text-text">{t("notFound")}</p>
          )}
          {mime && copied ? (
            <p className="mt-2 text-xs font-medium text-accent">{t("copied")}</p>
          ) : null}
        </div>
      ) : null}

      <label htmlFor="mime-search" className="mt-6 block text-sm font-medium text-text">
        {t("searchLabel")}
      </label>
      <input
        id="mime-search"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t("searchPlaceholder")}
        className="mt-2 w-full max-w-sm rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {matches.length > 0 ? (
        <div className="mt-4 max-h-72 max-w-xl overflow-auto rounded-lg border border-border">
          {matches.map(([e, mimeType], index) => (
            <button
              key={e}
              type="button"
              onClick={() => copyValue(mimeType)}
              className={`flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-sm transition-colors hover:bg-surface-2 ${
                index % 2 === 0 ? "bg-surface" : "bg-bg"
              }`}
            >
              <span className="font-mono text-text">{e}</span>
              <span className="truncate font-mono text-xs text-muted">
                {mimeType}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}