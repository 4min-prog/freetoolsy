"use client";

import { useState } from "react";

type Indent = "2" | "4" | "tab";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<Indent>("2");
  const [copied, setCopied] = useState(false);

  function parse(): unknown {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Önce JSON verisi girin.");
      setOutput("");
      return undefined;
    }
    try {
      const parsed: unknown = JSON.parse(trimmed);
      setError(null);
      return parsed;
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Geçersiz JSON.");
      return undefined;
    }
  }

  function format() {
    const parsed = parse();
    if (parsed === undefined) return;
    const space = indent === "tab" ? "\t" : Number(indent);
    setOutput(JSON.stringify(parsed, null, space));
  }

  function minify() {
    const parsed = parse();
    if (parsed === undefined) return;
    setOutput(JSON.stringify(parsed));
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label htmlFor="json-girdi" className="block text-sm font-medium text-text">
          JSON girdisi
        </label>
        <div className="flex items-center gap-2">
          <label htmlFor="json-indent" className="text-xs text-muted">
            Girinti
          </label>
          <select
            id="json-indent"
            value={indent}
            onChange={(event) => setIndent(event.target.value as Indent)}
            className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs text-text focus:border-accent focus:outline-none"
          >
            <option value="2">2 boşluk</option>
            <option value="4">4 boşluk</option>
            <option value="tab">Sekme</option>
          </select>
        </div>
      </div>

      <textarea
        id="json-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={8}
        spellCheck={false}
        placeholder={'{"ad": "FreetoolsY", "ucretsiz": true}'}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={format}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          Düzenle
        </button>
        <button
          type="button"
          onClick={minify}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          Sıkıştır
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}

      {output && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text">Sonuç</p>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied ? "Kopyalandı" : "Kopyala"}
            </button>
          </div>
          <pre className="mt-2 max-h-96 overflow-auto rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
