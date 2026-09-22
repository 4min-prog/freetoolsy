"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function serializeNode(node: Node, depth: number): string {
  const pad = "  ".repeat(depth);
  if (node.nodeType === 3) {
    const value = (node.nodeValue ?? "").trim();
    return value ? pad + escapeXml(value) : "";
  }
  if (node.nodeType === 8) {
    return pad + "<!--" + (node.nodeValue ?? "") + "-->";
  }
  if (node.nodeType === 10) {
    return pad + "<!DOCTYPE " + (node as DocumentType).name + ">";
  }
  if (node.nodeType !== 1) return "";
  const element = node as Element;
  let attrs = "";
  for (const attribute of Array.from(element.attributes)) {
    attrs += " " + attribute.name + '="' + escapeAttr(attribute.value) + '"';
  }
  const children = Array.from(element.childNodes);
  const childLines = children
    .map((child) => serializeNode(child, depth + 1))
    .filter((line) => line.length > 0);
  if (children.length === 1 && children[0].nodeType === 3) {
    const text = (children[0].nodeValue ?? "").trim();
    return (
      pad +
      "<" +
      element.tagName +
      attrs +
      ">" +
      escapeXml(text) +
      "</" +
      element.tagName +
      ">"
    );
  }
  if (childLines.length === 0) {
    return pad + "<" + element.tagName + attrs + "></" + element.tagName + ">";
  }
  return (
    pad +
    "<" +
    element.tagName +
    attrs +
    ">\n" +
    childLines.join("\n") +
    "\n" +
    pad +
    "</" +
    element.tagName +
    ">"
  );
}

function parseXml(source: string): Document {
  const doc = new DOMParser().parseFromString(source, "text/xml");
  const errors = doc.getElementsByTagName("parsererror");
  if (errors.length > 0) {
    throw new Error((errors[0].textContent ?? "").trim() || "Malformed XML");
  }
  return doc;
}

function formatXml(source: string): string {
  const doc = parseXml(source);
  const lines: string[] = [];
  for (const node of Array.from(doc.childNodes)) {
    const line = serializeNode(node, 0);
    if (line) lines.push(line);
  }
  return lines.join("\n");
}

function minifyXml(source: string): string {
  const doc = parseXml(source);
  const strip = (node: Node): void => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3 && (child.nodeValue ?? "").trim() === "") {
        node.removeChild(child);
      } else {
        strip(child);
      }
    }
  };
  strip(doc);
  return new XMLSerializer().serializeToString(doc);
}

export default function XmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.xmlFormatter");

  const hasOutput = useMemo(() => output.length > 0, [output]);

  function run(mode: "format" | "minify") {
    const source = input.trim();
    if (!source) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const result = mode === "format" ? formatXml(source) : minifyXml(source);
      setOutput(result);
      setError(null);
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label htmlFor="xml-girdi" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="xml-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run("format")}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("format")}
        </button>
        <button
          type="button"
          onClick={() => run("minify")}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {t("minify")}
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text">{t("outputLabel")}</p>
        <button
          type="button"
          onClick={copy}
          disabled={!hasOutput}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <textarea
        value={output}
        readOnly
        rows={10}
        spellCheck={false}
        placeholder=""
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {t("invalid", { message: error })}
        </p>
      )}
    </div>
  );
}