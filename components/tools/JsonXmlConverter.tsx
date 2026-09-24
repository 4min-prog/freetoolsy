"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function nameToken(key: string): string {
  const cleaned = key.replace(/[^a-zA-Z0-9_-]/g, "");
  return cleaned || "item";
}

function jsonToXml(value: unknown, key: string, depth: number): string {
  const indent = "  ".repeat(depth);
  const tag = nameToken(key);
  if (value === null || value === undefined) return `${indent}<${tag}/>`;
  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}<${tag}/>`;
    return value
      .map((item) => {
        if (item !== null && typeof item === "object") {
          return `${indent}<${tag}>\n${jsonToXml(item, tag, depth + 1)}${indent}</${tag}>`;
        }
        return `${indent}<${tag}>${escapeXml(String(item))}</${tag}>`;
      })
      .join("\n");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return `${indent}<${tag}/>`;
    return `${indent}<${tag}>\n${entries
      .map(([childKey, childValue]) => jsonToXml(childValue, childKey, depth + 1))
      .join("\n")}\n${indent}</${tag}>`;
  }
  return `${indent}<${tag}>${escapeXml(String(value))}</${tag}>`;
}

function nodeToJson(node: Element): unknown {
  const children: Element[] = Array.from(node.children);
  const text = (node.textContent ?? "").trim();
  if (children.length === 0) {
    return text;
  }
  const attrs: Record<string, string> = {};
  for (const attr of Array.from(node.attributes)) {
    attrs[`@${attr.name}`] = attr.value;
  }
  const result: Record<string, unknown> = { ...attrs };
  const grouped: Record<string, Element[]> = {};
  for (const child of children) {
    (grouped[child.tagName] ??= []).push(child);
  }
  for (const [tagName, nodes] of Object.entries(grouped)) {
    if (nodes.length === 1) {
      result[tagName] = nodeToJson(nodes[0]);
    } else {
      result[tagName] = nodes.map((n) => nodeToJson(n));
    }
  }
  return result;
}

export default function JsonXmlConverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"json-to-xml" | "xml-to-json">("json-to-xml");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.jsonXmlConverter");

  function convert() {
    setError("");
    setOutput("");
    if (!input.trim()) {
      setError(t("emptyInput"));
      return;
    }
    try {
      if (mode === "json-to-xml") {
        const parsed = JSON.parse(input.trim());
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(parsed, "root", 1)}\n</root>`;
        setOutput(xml);
      } else {
        if (typeof window === "undefined") return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(input.trim(), "application/xml");
        const parseError = doc.querySelector("parsererror");
        if (parseError) {
          setError(t("invalidXml"));
          return;
        }
        const root = doc.documentElement;
        setOutput(JSON.stringify(nodeToJson(root), null, 2));
      }
    } catch (err) {
      setError(t(mode === "json-to-xml" ? "invalidJson" : "invalidXml"));
      void err;
    }
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

  const sampleJson =
    '{\n  "user": {\n    "id": 1,\n    "name": "Ada",\n    "roles": ["admin", "editor"],\n    "active": true\n  }\n}';
  const sampleXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<user>\n  <id>1</id>\n  <name>Ada</name>\n  <roles>\n    <role>admin</role>\n    <role>editor</role>\n  </roles>\n  <active>true</active>\n</user>';

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("json-to-xml")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "json-to-xml"
              ? "btn-accent text-on-accent"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
          }`}
        >
          {t("modeJsonToXml")}
        </button>
        <button
          type="button"
          onClick={() => setMode("xml-to-json")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "xml-to-json"
              ? "btn-accent text-on-accent"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
          }`}
        >
          {t("modeXmlToJson")}
        </button>
      </div>

      <label htmlFor="jxc-input" className="mt-5 block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="jxc-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={8}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton
          onApply={() => setInput(mode === "json-to-xml" ? sampleJson : sampleXml)}
        />
        <button
          type="button"
          onClick={convert}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("convert")}
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-danger">{error}</p>
      ) : null}

      <label htmlFor="jxc-output" className="mt-5 block text-sm font-medium text-text">
        {t("outputLabel")}
      </label>
      <textarea
        id="jxc-output"
        value={output}
        readOnly
        rows={8}
        spellCheck={false}
        placeholder={t("emptyState")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {output ? (
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
