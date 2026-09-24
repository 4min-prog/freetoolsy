"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";


const PRESETS = [
  {
    id: "basic",
    label: "Basic",
    href: "/robots.txt",
    value: `User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml`,
  },
  {
    id: "strict",
    label: "Strict",
    href: "/robots.txt",
    value: `User-agent: *\nDisallow: /admin/\nDisallow: /api/\nDisallow: /private/\n\nSitemap: https://example.com/sitemap.xml`,
  },
  {
    id: "seo",
    label: "SEO",
    href: "/robots.txt",
    value: `User-agent: *\nAllow: /\nDisallow: /search\nDisallow: /cart\nDisallow: /checkout\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nSitemap: https://example.com/sitemap.xml`,
  },
];

function selectPreset(id: string) {
  return PRESETS.find((preset) => preset.id === id) ?? PRESETS[0];
}

export default function RobotsTxtGenerator() {
  const [activePreset, setActivePreset] = useState(PRESETS[0].id);
  const [customPath, setCustomPath] = useState("");
  const [customAction, setCustomAction] = useState<"allow" | "disallow">("disallow");
  const [siteName, setSiteName] = useState("");
  const [customLines, setCustomLines] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.robotsTxtGenerator");


  const preset = selectPreset(activePreset);

  const fullOutput = [
    preset.value,
    ...customLines.map(
      (line) => `${customAction === "allow" ? "Allow" : "Disallow"}: ${line}`
    ),
    siteName.trim()
      ? `Sitemap: ${siteName.trim().replace(/\/$/, "")}/sitemap.xml`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  function addRule() {
    const path = customPath.trim();
    if (!path) return;
    setCustomLines((current) => [...current, path]);
    setCustomPath("");
  }

  function removeRule(index: number) {
    setCustomLines((current) => current.filter((_, i) => i !== index));
  }

  function handleCopy() {
    if (!fullOutput) return;
    navigator.clipboard
      .writeText(fullOutput)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text">{t("presetLabel")}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActivePreset(item.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              item.id === activePreset
                ? "btn-accent text-on-accent"
                : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label htmlFor="rt-host" className="mt-5 block text-sm font-medium text-text">
        {t("siteLabel")}
      </label>
      <input
        id="rt-host"
        type="text"
        value={siteName}
        onChange={(event) => setSiteName(event.target.value)}
        placeholder="https://example.com"
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          addRule();
        }}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <div className="flex-1">
          <label htmlFor="rt-path" className="block text-sm font-medium text-text">
            {t("ruleLabel")}
          </label>
          <input
            id="rt-path"
            type="text"
            value={customPath}
            onChange={(event) => setCustomPath(event.target.value)}
            placeholder="/private/"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="rt-action" className="block text-sm font-medium text-text">
            {t("actionLabel")}
          </label>
          <select
            id="rt-action"
            value={customAction}
            onChange={(event) => setCustomAction(event.target.value as "allow" | "disallow")}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="disallow">{t("disallow")}</option>
            <option value="allow">{t("allow")}</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {t("add")}
        </button>
      </form>

      {customLines.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {customLines.map((line, index) => (
            <span
              key={`${line}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-1 text-xs text-muted"
            >
              {line}
              <button
                type="button"
                onClick={() => removeRule(index)}
                className="text-faint hover:text-danger"
                aria-label={t("remove")}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-2">
        <SampleButton
          onApply={() => {
            setActivePreset("strict");
            setSiteName("https://example.com");
          }}
        />
      </div>

      <div className="mt-5 rounded-lg border border-border bg-bg">
        <pre className="max-h-72 overflow-auto p-3 font-mono text-xs leading-relaxed text-text">
          {fullOutput}
        </pre>
      </div>

      {fullOutput ? (
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
