"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const TYPES = [
  "Article",
  "Product",
  "Person",
  "Organization",
  "FAQPage",
  "BreadcrumbList",
  "WebSite",
  "Event",
];

type Field = { key: string; label: string };

function buildJsonLd(type: string, base: { name: string; url: string; description: string }): string {
  let json: Record<string, unknown>;
  if (type === "Article") {
    json = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: base.name,
      description: base.description,
      url: base.url,
      author: { "@type": "Person", name: base.name },
    };
  } else if (type === "Product") {
    json = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: base.name,
      description: base.description,
      url: base.url,
      brand: { "@type": "Brand", name: base.name },
    };
  } else if (type === "Person") {
    json = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: base.name,
      url: base.url,
      description: base.description,
    };
  } else if (type === "Organization") {
    json = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: base.name,
      url: base.url,
      logo: `${base.url}/logo.png`,
      description: base.description,
    };
  } else if (type === "FAQPage") {
    json = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Example question?",
          acceptedAnswer: { "@type": "Answer", text: "Example answer." },
        },
      ],
    };
  } else if (type === "BreadcrumbList") {
    json = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base.url },
        { "@type": "ListItem", position: 2, name: base.name, item: `${base.url}/${base.name.toLowerCase()}` },
      ],
    };
  } else if (type === "Event") {
    json = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: base.name,
      description: base.description,
      url: base.url,
      startDate: new Date().toISOString().slice(0, 10),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    };
  } else {
    json = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: base.name,
      url: base.url,
      description: base.description,
    };
  }
  return JSON.stringify(json, null, 2);
}

export default function JsonLdGenerator() {
  const [type, setType] = useState("Article");
  const [fields, setFields] = useState<Record<string, string>>({
    name: "",
    url: "",
    description: "",
  });
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.jsonLdGenerator");

  const fieldDefs: Field[] = [
    { key: "name", label: t("nameLabel") },
    { key: "url", label: t("urlLabel") },
    { key: "description", label: t("descriptionLabel") },
  ];

  function setField(key: string, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    setError("");
    setOutput("");
    const base = {
      name: fields.name?.trim() || "My Site",
      url: fields.url?.trim() || "https://example.com",
      description: fields.description?.trim() || "Description",
    };
    if (fields.url && !/^https?:\/\//.test(fields.url.trim())) {
      setError(t("invalidUrl"));
      return;
    }
    const doc = {
      "@context": "https://schema.org",
      ...(JSON.parse(buildJsonLd(type, base)) as Record<string, unknown>),
    };
    setOutput(
      `<script type="application/ld+json">\n${JSON.stringify(doc, null, 2)}\n</script>`
    );
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <label htmlFor="sld-type" className="block text-sm font-medium text-text">
        {t("typeLabel")}
      </label>
      <select
        id="sld-type"
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {TYPES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <div className="mt-4 space-y-3">
        {fieldDefs.map((field) => (
          <div key={field.key}>
            <label htmlFor={`sld-${field.key}`} className="block text-sm font-medium text-text">
              {field.label}
            </label>
            <input
              id={`sld-${field.key}`}
              type="text"
              value={fields[field.key] ?? ""}
              onChange={(event) => setField(field.key, event.target.value)}
              placeholder={field.key === "url" ? "https://example.com" : ""}
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("generate")}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {output ? (
        <div className="mt-5">
          <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-bg p-3 font-mono text-xs leading-relaxed text-text">
            {output}
          </pre>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}