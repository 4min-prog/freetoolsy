"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function HtmlTableGenerator() {
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("4");
  const [data, setData] = useState("");
  const [generated, setGenerated] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.htmlTableGenerator");

  const parsedRows = useMemo(() => {
    const value = Number(rows);
    return Number.isInteger(value) ? Math.min(Math.max(value, 1), 50) : 3;
  }, [rows]);

  const parsedCols = useMemo(() => {
    const value = Number(cols);
    return Number.isInteger(value) ? Math.min(Math.max(value, 1), 12) : 4;
  }, [cols]);

  function parseData(): string[][] {
    const text = data.trim();
    if (!text) return [];
    return text
      .split("\n")
      .map((line) =>
        line
          .split(/(?:\t|\||;)/)
          .map((cell) => cell.trim())
          .filter((cell) => cell.length > 0)
      )
      .filter((row) => row.length > 0);
  }

  function generate() {
    setError("");
    setGenerated("");
    setShowPreview(false);
    const parsed = parseData();
    const table: string[][] = [];
    for (let r = 0; r < parsedRows; r++) {
      const row: string[] = [];
      for (let c = 0; c < parsedCols; c++) {
        row.push(parsed[r]?.[c] ?? "");
      }
      table.push(row);
    }
    if (parsed.length > parsedRows) {
      setError(t("extraRows", { count: parsed.length - parsedRows }));
    }
    const lines: string[] = [];
    lines.push('<table border="1" cellpadding="6" cellspacing="0">');
    lines.push("  <thead>");
    lines.push(
      `    <tr>${table[0]
        ? table[0]
            .map((cell) => `<th>${escapeHtml(cell)}</th>`)
            .join("")
        : ""}</tr>`
    );
    lines.push("  </thead>");
    lines.push("  <tbody>");
    const headerRow = table[0] ?? [];
    void headerRow;
    for (const row of table.slice(1)) {
      lines.push(
        `    <tr>${row
          .map((cell) => `<td>${escapeHtml(cell)}</td>`)
          .join("")}</tr>`
      );
    }
    lines.push("  </tbody>");
    lines.push("</table>");
    setGenerated(lines.join("\n"));
  }

  function handleCopy() {
    if (!generated) return;
    navigator.clipboard
      .writeText(generated)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="htg-rows" className="block text-sm font-medium text-text">
            {t("rowsLabel")}
          </label>
          <input
            id="htg-rows"
            type="number"
            min={1}
            max={50}
            value={rows}
            onChange={(event) => setRows(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="htg-cols" className="block text-sm font-medium text-text">
            {t("colsLabel")}
          </label>
          <input
            id="htg-cols"
            type="number"
            min={1}
            max={12}
            value={cols}
            onChange={(event) => setCols(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label htmlFor="htg-data" className="mt-4 block text-sm font-medium text-text">
        {t("dataLabel")}
      </label>
      <textarea
        id="htg-data"
        value={data}
        onChange={(event) => setData(event.target.value)}
        rows={5}
        spellCheck={false}
        placeholder={t("dataPlaceholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setData("Name\tAge\tCity\nAda\t30\tIstanbul\nLeo\t25\tAnkara")
          }
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {t("sample")}
        </button>
        <button
          type="button"
          onClick={generate}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("generate")}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-muted">{error}</p> : null}

      {generated ? (
        <div className="mt-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((current) => !current)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {showPreview ? t("showCode") : t("preview")}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          {showPreview ? (
            <div
              className="mt-3 overflow-auto rounded-lg border border-border bg-bg p-4"
              dangerouslySetInnerHTML={{ __html: generated }}
            />
          ) : (
            <pre className="mt-3 max-h-64 overflow-auto rounded-lg border border-border bg-bg p-3 font-mono text-xs leading-relaxed text-text">
              {generated}
            </pre>
          )}
        </div>
      ) : null}
    </div>
  );
}