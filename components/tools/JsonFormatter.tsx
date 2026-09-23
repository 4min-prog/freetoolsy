"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

type Indent = "2" | "4" | "tab";

const TOKEN_REGEX =
  /"(?:\\.|[^"\\])*"(?=\s*:)?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|./g;

function highlightLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = new RegExp(TOKEN_REGEX.source, TOKEN_REGEX.flags);
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = regex.exec(line)) !== null) {
    const raw = match[0];
    let className = "text-faint";
    if (raw.startsWith('"')) {
      const isKey = /^\s*:/.test(line.slice(regex.lastIndex));
      className = isKey ? "text-accent" : "text-success";
    } else if (/^-?\d/.test(raw)) {
      className = "text-warning";
    } else if (raw === "true" || raw === "false" || raw === "null") {
      className = "text-danger";
    }
    tokens.push(
      <span key={index} className={className}>
        {raw}
      </span>
    );
    index += 1;
  }
  return tokens;
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [rawOutput, setRawOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<Indent>("2");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.jsonFormatter");

  const lines = useMemo(
    () => (rawOutput ? rawOutput.split("\n") : []),
    [rawOutput]
  );

  function parse(): unknown {
    const trimmed = input.trim();
    if (!trimmed) {
      setError(t("emptyError"));
      setRawOutput("");
      return undefined;
    }
    try {
      const parsed: unknown = JSON.parse(trimmed);
      setError(null);
      return parsed;
    } catch (err) {
      setRawOutput("");
      setError(err instanceof Error ? err.message : t("invalidError"));
      return undefined;
    }
  }

  function format() {
    const parsed = parse();
    if (parsed === undefined) return;
    const space = indent === "tab" ? "\t" : Number(indent);
    setRawOutput(JSON.stringify(parsed, null, space));
  }

  function minify() {
    const parsed = parse();
    if (parsed === undefined) return;
    setRawOutput(JSON.stringify(parsed));
  }

  function clear() {
    setInput("");
    setRawOutput("");
    setError(null);
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(rawOutput);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label htmlFor="json-girdi" className="block text-sm font-medium text-text">
          {t("raw")}
        </label>
        <div className="flex items-center gap-2">
          <label htmlFor="json-indent" className="text-xs text-muted">
            {t("indent")}
          </label>
          <select
            id="json-indent"
            value={indent}
            onChange={(event) => setIndent(event.target.value as Indent)}
            className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-text focus:border-accent focus:outline-none"
          >
            <option value="2">{t("spaces2")}</option>
            <option value="4">{t("spaces4")}</option>
            <option value="tab">{t("tab")}</option>
          </select>
        </div>
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <div>
          <textarea
            id="json-girdi"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={12}
            spellCheck={false}
            placeholder={'{"name": "FreetoolsY", "free": true}'}
            className="w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <SampleButton onApply={() => setInput(SAMPLES["json-formatter"])} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={format}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {t("format")}
            </button>
            <button
              type="button"
              onClick={minify}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {t("minify")}
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-text">{t("formatted")}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copy}
                disabled={!rawOutput}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
              >
                {copied ? t("copied") : t("copy")}
              </button>
              <button
                type="button"
                onClick={clear}
                disabled={!input && !rawOutput && !error}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
              >
                {t("clear")}
              </button>
            </div>
          </div>

          <div
            aria-live="polite"
            className="mt-2 max-h-80 flex-1 overflow-auto rounded-lg border border-border bg-bg font-mono text-sm leading-relaxed text-text"
          >
            {lines.length === 0 ? (
              <p className="px-3.5 py-3 text-faint">
                {error ? "" : t("placeholderOutput")}
              </p>
            ) : (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index} className="align-top">
                      <td className="select-none border-r border-border px-2 py-0 text-right text-xs tabular-nums text-faint">
                        {index + 1}
                      </td>
                      <td className="whitespace-pre px-3.5 py-0">
                        {highlightLine(line)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}