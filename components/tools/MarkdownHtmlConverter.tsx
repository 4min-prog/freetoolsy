"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


function inlineMd(html: string): string {
  return html
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" />');
}

function mdToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const blocks: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inCode = false;
  let codeLines: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push(`<p>${inlineMd(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  function flushList() {
    if (listType) {
      blocks.push(`</${listType}>`);
      listType = null;
    }
  }

  function flushTable() {
    if (!inTable) return;
    const header = tableRows[0];
    const body = tableRows.slice(1);
    blocks.push("<table>");
    if (header) {
      blocks.push(
        `<thead><tr>${header.map((cell) => `<th>${inlineMd(cell.trim())}</th>`).join("")}</tr></thead>`
      );
    }
    if (body.length > 0) {
      blocks.push(
        `<tbody>${body
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${inlineMd(cell.trim())}</td>`).join("")}</tr>`
          )
          .join("")}</tbody>`
      );
    }
    blocks.push("</table>");
    inTable = false;
    tableRows = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const match = /^```(\w*)/.exec(line);
    if (match) {
      flushParagraph();
      flushList();
      flushTable();
      if (inCode) {
        blocks.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      continue;
    }

    const tableRow = /^\|(.+)\|/.exec(line);
    if (tableRow) {
      if (inTable) {
        const cells = line.slice(1, -1).split("|");
        if (!cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()))) {
          tableRows.push(cells.map((cell) => cell.trim()));
        }
      } else {
        inTable = true;
        tableRows = [line.slice(1, -1).split("|").map((cell) => cell.trim())];
      }
      flushParagraph();
      flushList();
      continue;
    }
    if (inTable) flushTable();

    const heading = /^(#{1,6})\s+(.*)/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      blocks.push(`<h${level}>${inlineMd(heading[2])}</h${level}>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push(`<blockquote><p>${inlineMd(line.replace(/^>\s?/, ""))}</p></blockquote>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      if (listType !== "ul") {
        flushList();
        blocks.push("<ul>");
        listType = "ul";
      }
      blocks.push(`<li>${inlineMd(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    const ordered = /^\d+\.\s+(.*)/.exec(line);
    if (ordered) {
      flushParagraph();
      if (listType !== "ol") {
        flushList();
        blocks.push("<ol>");
        listType = "ol";
      }
      blocks.push(`<li>${inlineMd(ordered[1])}</li>`);
      continue;
    }
    if (!line) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  flushList();
  flushTable();
  if (inCode) {
    blocks.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }
  return blocks.join("\n");
}

function htmlToMd(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const root = doc.body;

  function handleChildren(node: Node): string {
    return Array.from(node.childNodes)
      .map((child) => handleNode(child))
      .join("");
  }

  function handleNode(node: Node): string {
    if (node.nodeType === 3) return (node.textContent ?? "").replace(/\s*\n\s*/g, " ");
    if (node.nodeType === 8) return "";
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (tag === "br") return "\n";
    if (tag === "hr") return "\n---\n";
    if (tag === "a") {
      const href = el.getAttribute("href") ?? "";
      return `[${handleChildren(el)}](${href})`;
    }
    if (tag === "img") {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      return `![${alt}](${src})`;
    }
    if (tag === "strong" || tag === "b") return `**${handleChildren(el)}**`;
    if (tag === "em" || tag === "i") return `*${handleChildren(el)}*`;
    if (tag === "code") return `\`${handleChildren(el)}\``;
    if (tag === "pre") return `\n\`\`\`\n${el.textContent ?? ""}\n\`\`\`\n`;
    if (tag === "p" || tag === "div" || tag === "blockquote") {
      const prefix = tag === "blockquote" ? "> " : "";
      return `\n${prefix}${handleChildren(el).trim()}\n`;
    }
    if (/^h[1-6]$/.test(tag)) {
      const level = "#".repeat(Number(tag[1]));
      return `\n${level} ${handleChildren(el).trim()}\n`;
    }
    if (tag === "li") {
      const isOl = el.parentElement?.tagName.toLowerCase() === "ol";
      const item = handleChildren(el).trim();
      return isOl ? `1. ${item}\n` : `- ${item}\n`;
    }
    if (tag === "ul" || tag === "ol") return `\n${handleChildren(el)}\n`;
    if (tag === "table") {
      const rows: Element[] = Array.from(el.querySelectorAll("tr"));
      if (rows.length === 0) return "";
      const cells = (row: Element) =>
        Array.from(row.querySelectorAll("th, td")).map((c) => c.textContent?.trim() ?? "");
      const header = cells(rows[0]);
      const linesMd = [`| ${header.join(" | ")} |`, `| ${header.map(() => "---").join(" | ")} |`];
      for (const row of rows.slice(1)) {
        linesMd.push(`| ${cells(row).join(" | ")} |`);
      }
      return `\n${linesMd.join("\n")}\n`;
    }
    return handleChildren(el);
  }

  return handleChildren(root).replace(/\n{3,}/g, "\n\n").trim();
}

export default function MarkdownHtmlConverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"md-to-html" | "html-to-md">("md-to-html");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.markdownHtmlConverter");

  const output = mode === "md-to-html" ? mdToHtml(input).trim() : htmlToMd(input);

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

  const sampleMd = `# Title\n\nThis is **bold** and *italic* text with \`inline code\`.\n\n- First item\n- Second item\n\n[Link](https://example.com)\n\n\`\`\`js\nconst x = 1;\n\`\`\`\n\n| Name | Age |\n| ---- | --- |\n| Ada  | 30  |`;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("md-to-html");
            setShowPreview(false);
          }}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "md-to-html"
              ? "btn-accent text-on-accent"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
          }`}
        >
          {t("modeMdToHtml")}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("html-to-md");
            setShowPreview(false);
          }}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "html-to-md"
              ? "btn-accent text-on-accent"
              : "border border-border bg-surface text-muted hover:border-accent hover:text-text"
          }`}
        >
          {t("modeHtmlToMd")}
        </button>
      </div>

      <label htmlFor="mdc-input" className="mt-5 block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="mdc-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={9}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setInput(sampleMd)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {t("sample")}
        </button>
        {mode === "md-to-html" ? (
          <button
            type="button"
            onClick={() => setShowPreview((current) => !current)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {showPreview ? t("showHtml") : t("preview")}
          </button>
        ) : null}
      </div>

      <label htmlFor="mdc-output" className="mt-5 block text-sm font-medium text-text">
        {t("outputLabel")}
      </label>
      {showPreview && mode === "md-to-html" ? (
        <div
          className="prose-sm mt-2 min-h-[180px] w-full whitespace-pre-wrap rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text"
          dangerouslySetInnerHTML={{ __html: output }}
        />
      ) : (
        <textarea
          id="mdc-output"
          value={output}
          readOnly
          rows={9}
          spellCheck={false}
          placeholder={t("emptyState")}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-xs leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      )}

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
