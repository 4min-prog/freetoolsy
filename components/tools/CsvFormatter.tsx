"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

function parseCsv(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const text = input.replace(/\r\n?/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  rows.push(row);
  return rows;
}

function toTsv(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => (cell.includes("\t") ? `"${cell}"` : cell))
        .join("\t")
    )
    .join("\n");
}

export default function CsvFormatter() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.csvFormatter");

  const rows = useMemo(
    () =>
      input.trim()
        ? parseCsv(input, delimiter).filter((row) => row.some((cell) => cell.trim() !== ""))
        : [],
    [input, delimiter]
  );
  const cols = useMemo(
    () => rows.reduce((max, row) => Math.max(max, row.length), 0),
    [rows]
  );

  async function copy() {
    await copyToClipboard(toTsv(rows));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <label
        htmlFor="csv-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="csv-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="name,email,age"
        className="mt-2 h-36 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm text-muted">{t("delimiter")}</span>
        <div className="flex gap-1.5">
          {[",", ";", "\t"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setDelimiter(value)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-sm font-medium transition-colors ${
                delimiter === value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:border-strong"
              }`}
            >
              {value === "\t" ? "TAB" : value}
            </button>
          ))}
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-2">
            <p className="text-sm font-medium text-text">
              {t("previewTitle")}
            </p>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {copied ? t("copied") : t("copyTsv")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody>
                {rows.slice(0, 200).map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-border last:border-0"
                  >
                    {Array.from({ length: cols }, (_, colIndex) => (
                      <td
                        key={colIndex}
                        className="whitespace-pre-wrap border-r border-border px-3 py-1.5 align-top last:border-0"
                      >
                        {row[colIndex] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}