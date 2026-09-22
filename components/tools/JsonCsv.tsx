"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function escapeField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function jsonToCsv(data: unknown): string {
  const rows = Array.isArray(data) ? data : [data];
  const objects = rows.filter(
    (row): row is Record<string, unknown> =>
      typeof row === "object" && row !== null && !Array.isArray(row)
  );
  if (objects.length === 0) throw new Error("invalid");
  const headers = Array.from(
    new Set(objects.flatMap((row) => Object.keys(row)))
  );
  if (headers.length === 0) throw new Error("invalid");
  const lines = [
    headers.map(escapeField).join(","),
    ...objects.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return "";
          if (typeof value === "object") return escapeField(JSON.stringify(value));
          return escapeField(String(value));
        })
        .join(",")
    ),
  ];
  return lines.join("\n");
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (inQuotes) {
      if (char === '"') {
        if (csv[i + 1] === '"') {
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
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\r") {
      if (csv[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else if (char === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function csvToJson(csv: string): unknown {
  const rows = parseCsv(csv);
  if (rows.length === 0) throw new Error("invalid");
  const headers = rows[0];
  if (headers.some((header) => !header.trim())) throw new Error("invalid");
  return rows.slice(1).map((row) => {
    const object: Record<string, string> = {};
    headers.forEach((header, index) => {
      object[header] = row[index] ?? "";
    });
    return object;
  });
}

export default function JsonCsv() {
  const [direction, setDirection] = useState<"jsonToCsv" | "csvToJson">(
    "jsonToCsv"
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.jsonCsv");

  function convert() {
    const raw = input.trim();
    if (!raw) {
      setOutput("");
      setError(direction === "jsonToCsv" ? t("invalidJson") : t("invalidCsv"));
      return;
    }
    try {
      if (direction === "jsonToCsv") {
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new Error("invalid");
        }
        setOutput(jsonToCsv(parsed));
      } else {
        setOutput(JSON.stringify(csvToJson(raw), null, 2));
      }
      setError(null);
    } catch {
      setOutput("");
      setError(direction === "jsonToCsv" ? t("invalidJson") : t("invalidCsv"));
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
      <div className="flex flex-wrap gap-2">
        {[
          { value: "jsonToCsv" as const, label: t("modeJsonToCsv") },
          { value: "csvToJson" as const, label: t("modeCsvToJson") },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={direction === option.value}
            onClick={() => {
              setDirection(option.value);
              setOutput("");
              setError(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              direction === option.value
                ? "bg-accent text-on-accent"
                : "border border-border bg-surface text-muted hover:border-strong hover:text-text"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="json-csv-input"
            className="block text-sm font-medium text-text"
          >
            {t("inputLabel")}
          </label>
          <textarea
            id="json-csv-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={10}
            spellCheck={false}
            placeholder={
              direction === "jsonToCsv"
                ? '[{ "name": "FreetoolsY", "free": true }]'
                : 'name,free\nFreetoolsY,true'
            }
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={convert}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              {t("convert")}
            </button>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="json-csv-output"
            className="block text-sm font-medium text-text"
          >
            {t("outputLabel")}
          </label>
          <textarea
            id="json-csv-output"
            value={output}
            readOnly
            rows={10}
            spellCheck={false}
            placeholder="…"
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
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