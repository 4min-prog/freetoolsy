"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

export default function UrlParser() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.urlParser");

  const parsed = useMemo(() => {
    try {
      return new URL(url.trim());
    } catch {
      return null;
    }
  }, [url]);

  const rows = useMemo(() => {
    if (!parsed) return [];
    return [
      { key: t("protocol"), value: parsed.protocol },
      { key: t("host"), value: parsed.host },
      { key: t("hostname"), value: parsed.hostname },
      { key: t("port"), value: parsed.port || "—" },
      { key: t("path"), value: parsed.pathname },
      { key: t("query"), value: parsed.search || "—" },
      { key: t("hash"), value: parsed.hash || "—" },
      { key: t("username"), value: parsed.username || "—" },
      { key: t("password"), value: parsed.password ? "••••" : "—" },
      { key: t("origin"), value: parsed.origin },
    ];
  }, [parsed, t]);

  async function copy() {
    if (!parsed) return;
    await copyToClipboard(parsed.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="url-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <input
        id="url-input"
        type="text"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder={t("placeholder")}
        className="mt-2 w-full max-w-xl rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {parsed ? (
        <div className="mt-6 max-w-xl">
          <div className="overflow-hidden rounded-lg border border-border">
            {rows.map((row, index) => (
              <div
                key={row.key}
                className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm ${
                  index % 2 === 0 ? "bg-surface" : "bg-bg"
                }`}
              >
                <span className="text-muted">{row.key}</span>
                <span className="max-w-[70%] truncate font-mono text-text">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={copy}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      ) : url.trim() !== "" ? (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("invalid")}
        </p>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}