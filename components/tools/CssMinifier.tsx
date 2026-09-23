"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

function byteSize(value: string): number {
  return new TextEncoder().encode(value).length;
}

function minifyCss(source: string): string {
  let out = "";
  let i = 0;
  const n = source.length;
  while (i < n) {
    const ch = source[i];
    if (ch === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      out += ch;
      i += 1;
      while (i < n) {
        const c = source[i];
        out += c;
        if (c === "\\" && i + 1 < n) {
          out += source[i + 1];
          i += 2;
          continue;
        }
        i += 1;
        if (c === quote) break;
      }
      continue;
    }
    if (/\s/.test(ch)) {
      const prev = out.slice(-1);
      let j = i;
      while (j < n && /\s/.test(source[j])) j += 1;
      const next = j < n ? source[j] : "";
      if (!/[{}:;,]/.test(prev) && !/[{}:;,]/.test(next)) {
        out += " ";
      }
      i = j;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out.trim();
}

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.cssMinifier");

  const hasOutput = useMemo(() => output.length > 0, [output]);

  const sizes = useMemo(
    () => ({
      before: byteSize(input),
      after: byteSize(output),
    }),
    [input, output]
  );

  function minify() {
    setOutput(minifyCss(input));
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
      <label htmlFor="css-girdi" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="css-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["css-minifier"])} />
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