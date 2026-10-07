"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";

type Indent = "2" | "4" | "tab";
type View = "pretty" | "minified";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const TOKEN_REGEX =
  /"(?:\\.|[^"\\])*"(?=\s*:)?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|./g;

function highlightLine(line: string): ReactNode[] {
  const tokens: ReactNode[] = [];
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

type RowKind = "object" | "array" | "string" | "number" | "boolean" | "null";

interface Row {
  id: string;
  depth: number;
  keyText: string | null;
  kind: RowKind;
  value: string;
  childCount: number;
  isOpenLine: boolean;
  isCloseLine: boolean;
  isCollapsed: boolean;
}

function valueKind(value: unknown): RowKind {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const type = typeof value;
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (type === "object") return "object";
  return "string";
}

function leafText(value: unknown, kind: RowKind): string {
  if (kind === "string") return JSON.stringify(value as string);
  if (kind === "null") return "null";
  return String(value);
}

function leafClassName(kind: RowKind): string {
  if (kind === "string") return "text-success";
  if (kind === "number") return "text-warning";
  return "text-danger";
}

function childPath(parent: string, key: string): string {
  return `${parent}/${JSON.stringify(key)}`;
}

function childEntries(value: unknown): Array<[string, unknown]> {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index), item] as [string, unknown]);
  }
  return Object.entries(value as Record<string, unknown>);
}

function buildRows(
  value: unknown,
  collapsed: Set<string>,
  depth = 0,
  keyText: string | null = null,
  path = "$"
): Row[] {
  const kind = valueKind(value);
  const id = path;
  const isContainer = kind === "object" || kind === "array";

  if (!isContainer) {
    return [
      {
        id,
        depth,
        keyText,
        kind,
        value: leafText(value, kind),
        childCount: 0,
        isOpenLine: false,
        isCloseLine: false,
        isCollapsed: false,
      },
    ];
  }

  const entries = childEntries(value);
  const isCollapsed = collapsed.has(path);
  const rows: Row[] = [
    {
      id,
      depth,
      keyText,
      kind,
      value: "",
      childCount: entries.length,
      isOpenLine: true,
      isCloseLine: false,
      isCollapsed,
    },
  ];

  if (!isCollapsed) {
    for (const [childKey, child] of entries) {
      const childKeyText = kind === "array" ? null : JSON.stringify(childKey);
      rows.push(...buildRows(child, collapsed, depth + 1, childKeyText, childPath(path, childKey)));
    }
    rows.push({
      id: `${path}-close`,
      depth,
      keyText: null,
      kind,
      value: "",
      childCount: 0,
      isOpenLine: false,
      isCloseLine: true,
      isCollapsed: false,
    });
  }

  return rows;
}

function collectContainerPaths(value: unknown, path = "$"): string[] {
  if (value === null || typeof value !== "object") return [];
  const paths = [path];
  for (const [childKey, child] of childEntries(value)) {
    paths.push(...collectContainerPaths(child, childPath(path, childKey)));
  }
  return paths;
}

function collectStats(value: unknown): { keys: number; depth: number } {
  let keys = 0;
  let depth = 0;
  const walk = (node: unknown, level: number) => {
    if (node !== null && typeof node === "object") {
      depth = Math.max(depth, level);
      for (const [, child] of childEntries(node)) {
        if (!Array.isArray(node)) keys += 1;
        walk(child, level + 1);
      }
    }
  };
  walk(value, 1);
  return { keys, depth };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

interface ErrorLocation {
  line: number;
  column: number;
}

function locateError(message: string, source: string): ErrorLocation | null {
  const withLine = /line (\d+) column (\d+)/.exec(message);
  if (withLine) {
    return { line: Number(withLine[1]), column: Number(withLine[2]) };
  }
  const withPosition = /position (\d+)/.exec(message);
  if (!withPosition) return null;
  const offset = Math.min(Number(withPosition[1]), source.length);
  const before = source.slice(0, offset);
  const lastBreak = before.lastIndexOf("\n");
  return { line: before.split("\n").length, column: offset - lastBreak };
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [rawOutput, setRawOutput] = useState("");
  const [parsed, setParsed] = useState<unknown>(null);
  const [view, setView] = useState<View>("pretty");
  const [error, setError] = useState<string | null>(null);
  const [errorLocation, setErrorLocation] = useState<ErrorLocation | null>(null);
  const [indent, setIndent] = useState<Indent>("2");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const t = useTranslations("comp.jsonFormatter");

  const minifiedLines = useMemo(
    () => (rawOutput && view === "minified" ? rawOutput.split("\n") : []),
    [rawOutput, view]
  );

  const rows = useMemo(() => {
    if (!rawOutput || view !== "pretty" || parsed === null) return [];
    return buildRows(parsed, collapsed);
  }, [rawOutput, view, parsed, collapsed]);

  const stats = useMemo(() => {
    if (parsed === null) return null;
    return collectStats(parsed);
  }, [parsed]);

  const outputSize = useMemo(
    () => (rawOutput ? new Blob([rawOutput]).size : 0),
    [rawOutput]
  );

  const rowCount = view === "minified" ? minifiedLines.length : rows.length;

  const errorSourceLine = useMemo(() => {
    if (!errorLocation) return null;
    const sourceLine = input.split("\n")[errorLocation.line - 1];
    return sourceLine === undefined ? null : sourceLine;
  }, [errorLocation, input]);

  function parse(): unknown {
    const trimmed = input.trim();
    if (!trimmed) {
      setError(t("emptyError"));
      setErrorLocation(null);
      setRawOutput("");
      setParsed(null);
      return undefined;
    }
    try {
      const value: unknown = JSON.parse(trimmed);
      setError(null);
      setErrorLocation(null);
      return value;
    } catch (err) {
      const message = err instanceof Error ? err.message : t("invalidError");
      setRawOutput("");
      setParsed(null);
      setError(message);
      setErrorLocation(locateError(message, trimmed));
      return undefined;
    }
  }

  function format() {
    const value = parse();
    if (value === undefined) return;
    const space = indent === "tab" ? "\t" : Number(indent);
    setRawOutput(JSON.stringify(value, null, space));
    setParsed(value);
    setView("pretty");
  }

  function minify() {
    const value = parse();
    if (value === undefined) return;
    setRawOutput(JSON.stringify(value));
    setParsed(value);
    setView("minified");
  }

  function reset() {
    setInput("");
    setRawOutput("");
    setParsed(null);
    setError(null);
    setErrorLocation(null);
    setCopied(false);
    setFileName(null);
    setView("pretty");
    setCollapsed(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  function download() {
    if (!rawOutput) return;
    const base = fileName ? fileName.replace(/\.json$/i, "") : "formatted";
    const blob = new Blob([rawOutput], { type: "application/json;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${base}-formatted.json`;
    link.href = href;
    link.click();
    URL.revokeObjectURL(href);
    showToast("download");
  }

  async function loadFile(file: File) {
    if (!/\.json$/i.test(file.name)) {
      setError(t("fileTypeError"));
      setErrorLocation(null);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(t("fileTooLarge"));
      setErrorLocation(null);
      return;
    }
    try {
      const text = await file.text();
      setInput(text);
      setFileName(file.name);
      setCollapsed(new Set());
      setCopied(false);
      setError(null);
      setErrorLocation(null);
    } catch {
      setError(t("fileReadError"));
      setErrorLocation(null);
    }
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files && event.target.files[0];
    if (selected) void loadFile(selected);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    const dropped = event.dataTransfer.files && event.dataTransfer.files[0];
    if (dropped) void loadFile(dropped);
  }

  function onDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  }

  function onDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  }

  function onDropzoneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (fileInputRef.current) fileInputRef.current.click();
    }
  }

  function toggleRow(row: Row) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(row.id)) {
        next.delete(row.id);
      } else {
        next.add(row.id);
      }
      return next;
    });
  }

  function collapseAll() {
    if (parsed === null) return;
    setCollapsed(new Set(collectContainerPaths(parsed)));
  }

  function expandAll() {
    setCollapsed(new Set());
  }

  function renderRow(row: Row, lineNumber: number) {
    const indentStyle = { paddingLeft: `${8 + row.depth * 16}px` };

    if (row.isCloseLine) {
      return (
        <tr key={row.id} className="align-top">
          <td className="select-none border-r border-border px-2 py-0 text-right text-xs tabular-nums text-faint">
            {lineNumber}
          </td>
          <td className="whitespace-pre py-0 font-mono text-faint" style={indentStyle}>
            {row.kind === "array" ? "]" : "}"}
          </td>
        </tr>
      );
    }

    const isContainer = row.kind === "object" || row.kind === "array";
    const isLeaf = !isContainer;

    return (
      <tr key={row.id} className="align-top">
        <td className="select-none border-r border-border px-2 py-0 text-right text-xs tabular-nums text-faint">
          {lineNumber}
        </td>
        <td className="whitespace-pre py-0 font-mono" style={indentStyle}>
          <span className="inline-flex items-center gap-1">
            {isContainer && (
              <button
                type="button"
                onClick={() => toggleRow(row)}
                aria-expanded={!row.isCollapsed}
                aria-label={t("toggleSection")}
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-faint transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <span
                  aria-hidden="true"
                  className={`text-[10px] leading-none transition-transform ${row.isCollapsed ? "" : "rotate-90"}`}
                >
                  ▶
                </span>
              </button>
            )}
            {isLeaf && <span className="inline-block w-4 shrink-0" />}
            {row.keyText && (
              <>
                <span className="text-accent">{row.keyText}</span>
                <span className="text-faint">: </span>
              </>
            )}
            {isContainer && (
              <>
                <span className="text-faint">{row.kind === "array" ? "[" : "{"}</span>
                {row.isCollapsed && (
                  <span className="ml-1 text-[11px] text-faint">
                    {row.childCount} {t("hiddenItems")}
                  </span>
                )}
              </>
            )}
            {isLeaf && (
              <span className={leafClassName(row.kind)}>{row.value}</span>
            )}
          </span>
        </td>
      </tr>
    );
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

      <div
        onDragEnter={onDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onKeyDown={onDropzoneKeyDown}
        role="button"
        tabIndex={0}
        aria-label={t("dropFile")}
        className={`mt-2 cursor-pointer rounded-lg border border-dashed px-3.5 py-3 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 ${
          dragging ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-accent"
        }`}
      >
        <p className="text-xs font-medium text-text">{t("dropFile")}</p>
        <p className="mt-0.5 text-xs text-faint">{t("orBrowse")}</p>
        {fileName && (
          <p className="mt-1 truncate text-xs text-muted">
            {t("fileName")}: {fileName}
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={onFileChange}
          onClick={(event) => event.stopPropagation()}
          className="hidden"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <textarea
            id="json-girdi"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={12}
            spellCheck={false}
            placeholder={'{"name": "FreetoolsY", "free": true}'}
            className={`w-full resize-y rounded-lg border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent/30 ${
              errorLocation ? "border-danger" : "border-border focus:border-accent"
            }`}
          />
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-text">{t("formatted")}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copy}
                disabled={!rawOutput}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-xs min-h-10 font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
              >
                {copied ? t("copied") : t("copy")}
              </button>
              <button
                type="button"
                onClick={download}
                disabled={!rawOutput}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-xs min-h-10 font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
              >
                {t("download")}
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={!input && !rawOutput && !error}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-xs min-h-10 font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
              >
                {t("clear")}
              </button>
            </div>
          </div>

          {stats && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-muted">
                {t("totalKeys")}:{" "}
                <span className="tabular-nums text-text">{stats.keys}</span>
              </span>
              <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-muted">
                {t("depth")}:{" "}
                <span className="tabular-nums text-text">{stats.depth}</span>
              </span>
              <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-muted">
                {t("lines")}:{" "}
                <span className="tabular-nums text-text">{rowCount}</span>
              </span>
              <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-muted">
                {t("size")}:{" "}
                <span className="tabular-nums text-text">{formatBytes(outputSize)}</span>
              </span>
              {view === "pretty" && (
                <>
                  <button
                    type="button"
                    onClick={expandAll}
                    disabled={collapsed.size === 0}
                    className="rounded-lg border border-border bg-surface px-2.5 py-1 font-medium text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                  >
                    {t("expandAll")}
                  </button>
                  <button
                    type="button"
                    onClick={collapseAll}
                    disabled={collapsed.size === 0}
                    className="rounded-lg border border-border bg-surface px-2.5 py-1 font-medium text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                  >
                    {t("collapseAll")}
                  </button>
                </>
              )}
            </div>
          )}

          <div
            id="json-output"
            aria-live="polite"
            className="mt-2 max-h-80 flex-1 overflow-auto rounded-lg border border-border bg-bg font-mono text-sm leading-relaxed text-text"
          >
            {rowCount === 0 ? (
              <p className="px-3.5 py-3 text-faint">
                {error ? "" : t("placeholderOutput")}
              </p>
            ) : view === "minified" ? (
              <table className="w-full border-collapse">
                <tbody>
                  {minifiedLines.map((line, index) => (
                    <tr key={index} className="align-top">
                      <td className="select-none border-r border-border px-2 py-0 text-right text-xs tabular-nums text-faint">
                        {index + 1}
                      </td>
                      <td className="whitespace-pre break-all px-3.5 py-0">
                        {highlightLine(line)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full border-collapse">
                <tbody>
                  {rows.map((row, index) => renderRow(row, index + 1))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          <p>{error}</p>
          {errorLocation && (
            <p className="mt-1 text-xs">
              {t("errorAtLine", { line: errorLocation.line })}
              {` · ${t("errorColumn", { column: errorLocation.column })}`}
            </p>
          )}
          {errorSourceLine !== null && (
            <pre className="mt-1.5 overflow-x-auto whitespace-pre rounded-md bg-bg px-2 py-1 font-mono text-xs text-text">
              {errorSourceLine}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}