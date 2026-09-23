"use client";

import { showToast } from "@/lib/toast";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const RAW_TAGS = new Set(["pre", "script", "style"]);

function indent(depth: number): string {
  return "  ".repeat(depth);
}

function pushText(lines: string[], depth: number, text: string): void {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed) lines.push(indent(depth) + collapsed);
}

function formatHtml(source: string): string {
  const lines: string[] = [];
  const n = source.length;
  let depth = 0;
  let i = 0;

  while (i < n) {
    const ch = source[i];
    if (ch !== "<") {
      let j = i;
      while (j < n && source[j] !== "<") j += 1;
      pushText(lines, depth, source.slice(i, j));
      i = j;
      continue;
    }

    if (source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i + 4);
      const stop = end === -1 ? n : end + 3;
      lines.push(indent(depth) + source.slice(i, stop));
      i = stop;
      continue;
    }

    if (source.startsWith("<!", i)) {
      const end = source.indexOf(">", i);
      const stop = end === -1 ? n : end + 1;
      lines.push(indent(depth) + source.slice(i, stop));
      i = stop;
      continue;
    }

    const match = /^<\s*(\/?)\s*([a-zA-Z][^\s/>]*)/.exec(source.slice(i));
    if (!match) {
      let j = i + 1;
      while (j < n && source[j] !== "<") j += 1;
      pushText(lines, depth, source.slice(i, j));
      i = j;
      continue;
    }

    let quote = "";
    let j = i + 1;
    while (j < n) {
      const c = source[j];
      if (c === '"' || c === "'") {
        if (quote) {
          if (quote === c) quote = "";
        } else {
          quote = c;
        }
      } else if (!quote && c === ">") {
        break;
      }
      j += 1;
    }
    const end = j < n ? j + 1 : n;
    const tagText = source.slice(i, end);
    const name = match[2].toLowerCase();
    const isClose = match[1] === "/";

    if (isClose) {
      depth = Math.max(0, depth - 1);
      lines.push(indent(depth) + tagText);
      i = end;
      continue;
    }

    lines.push(indent(depth) + tagText);
    const selfClose = /\/\s*>$/.test(tagText);

    if (!selfClose && RAW_TAGS.has(name)) {
      const closePattern = new RegExp("^<\\s*\\/\\s*" + name + "\\s*>", "i");
      let k = end;
      let closeAt = -1;
      let closeLen = 0;
      while (k < n) {
        if (source[k] === "<") {
          const closeMatch = closePattern.exec(source.slice(k));
          if (closeMatch) {
            closeAt = k;
            closeLen = closeMatch[0].length;
            break;
          }
        }
        k += 1;
      }
      const rawEnd = closeAt === -1 ? n : closeAt;
      const raw = source.slice(end, rawEnd).trim();
      if (raw) lines.push(raw);
      if (closeAt !== -1) {
        lines.push(indent(depth) + source.slice(closeAt, closeAt + closeLen));
        i = closeAt + closeLen;
      } else {
        i = n;
      }
      continue;
    }

    if (!selfClose && !VOID_TAGS.has(name)) depth += 1;
    i = end;
  }

  return lines.join("\n");
}

export default function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.htmlFormatter");

  function run() {
    if (!input.trim()) {
      setOutput("");
      setError(t("emptyError"));
      setCopied(false);
      return;
    }
    setOutput(formatHtml(input));
    setError(null);
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label htmlFor="htmlf-girdi" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="htmlf-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["html-formatter"])} />
      </div>
      <button
        type="button"
        onClick={run}
        className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("format")}
      </button>

      <div className="mt-5 flex items-center justify-between gap-2">
        <label htmlFor="htmlf-cikti" className="text-sm font-medium text-text">
          {t("outputLabel")}
        </label>
        <button
          type="button"
          onClick={copy}
          disabled={!output}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <textarea
        id="htmlf-cikti"
        value={output}
        readOnly
        rows={12}
        spellCheck={false}
        placeholder=""
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text"
        >
          {error}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}