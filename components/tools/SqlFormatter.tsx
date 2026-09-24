"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const STARTER_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "GROUP", "ORDER", "HAVING", "LIMIT", "OFFSET",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "FROM",
  "JOIN", "INNER", "LEFT", "RIGHT", "OUTER", "CROSS", "FULL",
  "UNION", "UNION ALL", "ON", "AND", "OR", "CASE", "WHEN", "THEN", "ELSE", "END",
  "CREATE", "ALTER", "DROP", "TABLE", "INDEX",
]);

function tokenize(sql: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let index = 0;
  while (index < sql.length) {
    const char = sql[index];
    const next = sql[index + 1];
    if (char === "'" || char === '"' || char === "`") {
      if (current.trim()) tokens.push(current);
      current = "";
      const quote = char;
      let str = "";
      index++;
      while (index < sql.length) {
        if (sql[index] === "\\" && quote !== "`") {
          str += sql[index] + (sql[index + 1] ?? "");
          index += 2;
          continue;
        }
        if (sql[index] === quote) {
          index++;
          break;
        }
        str += sql[index];
        index++;
      }
      tokens.push(quote + str + quote);
      continue;
    }
    if (char === "-" && next === "-") {
      if (current.trim()) tokens.push(current);
      current = "";
      while (index < sql.length && sql[index] !== "\n") {
        current += sql[index];
        index++;
      }
      tokens.push(current.trim());
      current = "";
      continue;
    }
    if (char === "/" && next === "*") {
      if (current.trim()) tokens.push(current);
      current = "";
      index += 2;
      while (index + 1 < sql.length && !(sql[index] === "*" && sql[index + 1] === "/")) {
        current += sql[index];
        index++;
      }
      index = Math.min(index + 2, sql.length);
      tokens.push("/*" + current + "*/");
      current = "";
      continue;
    }
    if (char === "(" || char === ")" || char === ",") {
      if (current.trim()) tokens.push(current.trim());
      current = "";
      tokens.push(char);
      index++;
      continue;
    }
    if (/\s/.test(char)) {
      if (current.trim()) tokens.push(current.trim());
      current = "";
      index++;
      continue;
    }
    current += char;
    index++;
  }
  if (current.trim()) tokens.push(current.trim());
  return tokens;
}

function applyCase(token: string, mode: "upper" | "lower" | "keep"): string {
  if (mode === "upper") return token.toUpperCase();
  if (mode === "lower") return token.toLowerCase();
  return token;
}

function isKeyword(token: string): boolean {
  return STARTER_KEYWORDS.has(token.toUpperCase());
}

export default function SqlFormatter() {
  const [sql, setSql] = useState("");
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "keep">("upper");
  const [indentSize, setIndentSize] = useState<2 | 4>(2);
  const [minify, setMinify] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.sqlFormatter");

  const output = useMemo(() => {
    if (!sql.trim()) return "";
    const tokens = tokenize(sql);
    const lines: string[] = [];
    let depth = 0;
    let line = "";
    const indentStr = " ".repeat(indentSize);

    function flush() {
      if (line.trim()) lines.push(indentStr.repeat(depth) + line.trim());
      line = "";
    }

    for (let i = 0; i < tokens.length; i++) {
      const raw = tokens[i];
      const token = applyCase(raw, keywordCase);

      if (raw === "(") {
        flush();
        depth++;
        lines.push(indentStr.repeat(Math.max(depth - 1, 0)) + "(");
        continue;
      }
      if (raw === ")") {
        flush();
        depth = Math.max(depth - 1, 0);
        lines.push(indentStr.repeat(depth) + ")");
        continue;
      }
      if (raw === ",") {
        line += ",";
        flush();
        continue;
      }

      const isComment = raw.startsWith("--") || raw.startsWith("/*");
      if (!minify && isComment) {
        flush();
        lines.push(indentStr.repeat(depth) + raw);
        continue;
      }

      if (isKeyword(raw) && !minify) {
        flush();
        line = token;
        continue;
      }

      if (!minify) {
        line = line ? `${line} ${token}` : token;
      } else {
        line += line ? ` ${token}` : token;
      }
    }
    flush();
    const body = minify
      ? lines.join(" ").replace(/\s+/g, " ").trim()
      : lines.join("\n");
    return body;
  }, [sql, keywordCase, indentSize, minify]);

  function handleCopy() {
    if (!output) return;
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <label htmlFor="sql-input" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="sql-input"
        value={sql}
        onChange={(event) => setSql(event.target.value)}
        rows={8}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton
          onApply={() =>
            setSql("SELECT u.name, o.total FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE u.active = 1 AND o.total > 100 ORDER BY o.total DESC")
          }
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="radio"
            checked={keywordCase === "upper"}
            onChange={() => setKeywordCase("upper")}
            className="accent-accent"
          />
          {t("keywordUpper")}
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="radio"
            checked={keywordCase === "lower"}
            onChange={() => setKeywordCase("lower")}
            className="accent-accent"
          />
          {t("keywordLower")}
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="radio"
            checked={keywordCase === "keep"}
            onChange={() => setKeywordCase("keep")}
            className="accent-accent"
          />
          {t("keywordKeep")}
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="radio"
            checked={indentSize === 2}
            onChange={() => setIndentSize(2)}
            className="accent-accent"
          />
          {t("indent2")}
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="radio"
            checked={indentSize === 4}
            onChange={() => setIndentSize(4)}
            className="accent-accent"
          />
          {t("indent4")}
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={minify}
            onChange={(event) => setMinify(event.target.checked)}
            className="accent-accent"
          />
          {t("minify")}
        </label>
      </div>

      <label htmlFor="sql-output" className="mt-5 block text-sm font-medium text-text">
        {t("outputLabel")}
      </label>
      <textarea
        id="sql-output"
        value={output}
        readOnly
        rows={8}
        spellCheck={false}
        placeholder={t("emptyState")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {output ? (
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      ) : null}
    </div>
  );
}
