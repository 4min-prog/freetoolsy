"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const PRESERVE_TAGS = new Set(["pre", "textarea", "script", "style"]);

function byteSize(value: string): number {
  return new TextEncoder().encode(value).length;
}

function minifyHtml(source: string): string {
  let out = "";
  let i = 0;
  let preserve = "";
  const n = source.length;
  while (i < n) {
    const ch = source[i];
    if (preserve) {
      if (ch === "<") {
        const closing = new RegExp(
          "^<\\s*\\/\\s*" + preserve + "\\s*>",
          "i"
        ).exec(source.slice(i));
        if (closing) {
          out += closing[0];
          preserve = "";
          i += closing[0].length;
          continue;
        }
      }
      out += ch;
      i += 1;
      continue;
    }
    if (ch === "<") {
      if (source.startsWith("<!--", i)) {
        const end = source.indexOf("-->", i + 4);
        i = end === -1 ? n : end + 3;
        continue;
      }
      const match = /^<\s*\/?\s*([a-zA-Z][^\s/>]*)/.exec(source.slice(i));
      if (!match) {
        out += ch;
        i += 1;
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
      const name = match[1].toLowerCase();
      if (PRESERVE_TAGS.has(name) && !/\/\s*>$/.test(tagText) && !/^<\s*\//.test(tagText)) {
        preserve = name;
      }
      out += tagText;
      i = end;
      continue;
    }
    if (/\s/.test(ch)) {
      let j = i;
      let hasNewline = false;
      while (j < n && /\s/.test(source[j])) {
        if (source[j] === "\n" || source[j] === "\r") hasNewline = true;
        j += 1;
      }
      const prev = out.slice(-1);
      const next = j < n ? source[j] : "";
      if (prev === ">" || next === "<") {
        i = j;
        continue;
      }
      out += hasNewline ? " " : source.slice(i, j);
      i = j;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out.trim();
}

export default function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.htmlMinifier");

  const hasOutput = useMemo(() => output.length > 0, [output]);

  const sizes = useMemo(
    () => ({
      before: byteSize(input),
      after: byteSize(output),
    }),
    [input, output]
  );

  function minify() {
    setOutput(minifyHtml(input));
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
      <label htmlFor="html-girdi" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="html-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["html-minifier"])} />
      </div>
      <button
        type="button"
        onClick={minify}
        className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("minify")}
      </button>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
        <div className="bg-surface px-4 py-3">
          <dt className="text-xs text-muted">{t("before")}</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
            {sizes.before} B
          </dd>
        </div>
        <div className="bg-surface px-4 py-3">
          <dt className="text-xs text-muted">{t("after")}</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
            {sizes.after} B
          </dd>
        </div>
      </dl>

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
        rows={8}
        spellCheck={false}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {!hasOutput && (
        <p className="mt-2 text-xs leading-relaxed text-muted">{t("sameHint")}</p>
      )}
    </div>
  );
}