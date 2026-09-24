"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

function unescapeDouble(value: string): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    const ch = value[i];
    if (ch === "\\" && i + 1 < value.length) {
      const next = value[i + 1];
      if (next === "n") out += "\n";
      else if (next === "t") out += "\t";
      else if (next === "r") out += "\r";
      else if (next === '"') out += '"';
      else if (next === "\\") out += "\\";
      else out += next;
      i += 2;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
}

function parseYamlScalar(raw: string): string | number | boolean | null {
  const value = raw.trim();
  if (value === "" || value === "null" || value === "~") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return unescapeDouble(value.slice(1, -1));
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) {
    return Number(value);
  }
  return value;
}

function unquoteKey(raw: string): string {
  const value = raw.trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return unescapeDouble(value.slice(1, -1));
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function splitKeyValue(content: string): [string, string | null] | null {
  let i = 0;
  while (i < content.length) {
    const ch = content[i];
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i += 1;
      while (i < content.length) {
        const c = content[i];
        if (c === "\\" && i + 1 < content.length) {
          i += 2;
          continue;
        }
        i += 1;
        if (c === quote) break;
      }
      continue;
    }
    if (ch === ":") {
      const after = content.slice(i + 1);
      if (after === "" || /^\s/.test(after)) {
        const key = content.slice(0, i).trim();
        const rest = after.replace(/^\s+/, "");
        return [key, rest === "" ? null : rest];
      }
    }
    i += 1;
  }
  return null;
}

function parseYaml(source: string): unknown {
  type Row = { indent: number; content: string };
  const rows: Row[] = [];
  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    rows.push({
      indent: raw.length - raw.trimStart().length,
      content: trimmed,
    });
  }
  if (rows.length === 0) return null;

  let index = 0;

  const isListItem = (content: string): boolean =>
    content === "-" || content.startsWith("- ");

  const parseList = (indent: number): unknown[] => {
    const result: unknown[] = [];
    while (
      index < rows.length &&
      rows[index].indent === indent &&
      isListItem(rows[index].content)
    ) {
      const rest =
        rows[index].content === "-"
          ? ""
          : rows[index].content.slice(2).trim();
      index += 1;
      if (rest === "") {
        if (index < rows.length && rows[index].indent > indent) {
          result.push(parseBlock(rows[index].indent));
        } else {
          result.push(null);
        }
      } else if (splitKeyValue(rest)) {
        rows.splice(index, 0, { indent: indent + 2, content: rest });
        result.push(parseBlock(indent + 2));
      } else {
        result.push(parseYamlScalar(rest));
      }
    }
    return result;
  };

  const parseMap = (indent: number): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    while (index < rows.length && rows[index].indent === indent) {
      const row = rows[index];
      if (isListItem(row.content)) break;
      const split = splitKeyValue(row.content);
      if (!split) {
        throw new Error("line " + (index + 1) + ': "' + row.content + '"');
      }
      const key = unquoteKey(split[0]);
      const inline = split[1];
      index += 1;
      if (inline !== null) {
        result[key] = parseYamlScalar(inline);
      } else if (index < rows.length && rows[index].indent > indent) {
        result[key] = parseBlock(rows[index].indent);
      } else {
        result[key] = null;
      }
    }
    return result;
  };

  function parseBlock(indent: number): unknown {
    if (index >= rows.length) return null;
    if (isListItem(rows[index].content)) return parseList(indent);
    return parseMap(indent);
  }

  const root = parseBlock(rows[0].indent);
  if (index < rows.length) {
    throw new Error("unexpected content: " + rows[index].content);
  }
  return root;
}

function plainScalarSafe(value: string): boolean {
  if (value.length === 0 || value !== value.trim()) return false;
  if (/[\n\r]/.test(value)) return false;
  if (/^(?:true|false|null|~)$/i.test(value)) return false;
  if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) return false;
  if (/^[\s#&*!|>'"%@`?,\[\]{}:$-]/.test(value)) return false;
  if (/:(\s|$)/.test(value) || /^-\s/.test(value) || /\s#/.test(value)) {
    return false;
  }
  return true;
}

function yamlScalar(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
  if (Array.isArray(value)) return "[]";
  if (typeof value === "object") return "{}";
  if (typeof value === "string") {
    return plainScalarSafe(value) ? value : JSON.stringify(value);
  }
  return "";
}

function yamlKey(key: string): string {
  return plainScalarSafe(key) ? key : JSON.stringify(key);
}

function isBlock(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }
  return false;
}

function toYamlBlock(value: unknown, indent: number): string {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isBlock(item)) {
          return pad + "-\n" + toYamlBlock(item, indent + 2);
        }
        return pad + "- " + yamlScalar(item);
      })
      .join("\n");
  }
  return Object.entries(value as Record<string, unknown>)
    .map(([key, child]) => {
      const keyLine = pad + yamlKey(key) + ":";
      if (isBlock(child)) {
        return keyLine + "\n" + toYamlBlock(child, indent + 2);
      }
      return keyLine + " " + yamlScalar(child);
    })
    .join("\n");
}

function jsonToYaml(value: unknown): string {
  if (Array.isArray(value)) {
    return value.length > 0 ? toYamlBlock(value, 0) : "[]";
  }
  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length > 0
      ? toYamlBlock(value, 0)
      : "{}";
  }
  return yamlScalar(value);
}

type Mode = "yamlToJson" | "jsonToYaml";

export default function YamlJson() {
  const [mode, setMode] = useState<Mode>("yamlToJson");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.yamlJsonConverter");

  const hasOutput = useMemo(() => output.length > 0, [output]);

  function convert() {
    const source = input.trim();
    if (!source) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      if (mode === "yamlToJson") {
        setOutput(JSON.stringify(parseYaml(source), null, 2));
      } else {
        setOutput(jsonToYaml(JSON.parse(source)));
      }
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setOutput("");
      setError(
        mode === "yamlToJson"
          ? t("invalidYaml", { message })
          : t("invalidJson", { message })
      );
    }
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

  const modes: { value: Mode; label: string }[] = [
    { value: "yamlToJson", label: t("modeYamlToJson") },
    { value: "jsonToYaml", label: t("modeJsonToYaml") },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {modes.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setMode(item.value);
              setError(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === item.value
                ? "bg-accent text-on-accent hover:opacity-90"
                : "border border-border bg-surface text-muted hover:border-strong hover:text-text"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label htmlFor="yaml-girdi" className="mt-5 block text-sm font-medium text-text">
        {t("inputLabel")}
      </label>
      <textarea
        id="yaml-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        spellCheck={false}
        placeholder=""
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["yaml-json-converter"])} />
      </div>
      <button
        type="button"
        onClick={convert}
        className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("convert")}
      </button>

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
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

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