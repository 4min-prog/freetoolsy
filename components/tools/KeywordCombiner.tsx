"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { copyToClipboard } from "@/lib/clipboard";

export default function KeywordCombiner() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.keywordCombiner");

  const leftList = useMemo(
    () => left.split("\n").map((line) => line.trim()).filter(Boolean),
    [left]
  );
  const rightList = useMemo(
    () => right.split("\n").map((line) => line.trim()).filter(Boolean),
    [right]
  );

  const output = useMemo(() => {
    if (!leftList.length || !rightList.length) return "";
    const lines: string[] = [];
    for (const a of leftList) {
      for (const b of rightList) {
        lines.push(`${a} ${b}`);
      }
    }
    return lines.join("\n");
  }, [leftList, rightList]);

  function copyOutput() {
    copyToClipboard(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kc-left" className="block text-xs font-medium text-muted">
            {t("listALabel")} ({leftList.length})
          </label>
          <textarea
            id="kc-left"
            value={left}
            onChange={(event) => setLeft(event.target.value)}
            placeholder={t("aPlaceholder")}
            className="mt-1 min-h-32 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="kc-right" className="block text-xs font-medium text-muted">
            {t("listBLabel")} ({rightList.length})
          </label>
          <textarea
            id="kc-right"
            value={right}
            onChange={(event) => setRight(event.target.value)}
            placeholder={t("bPlaceholder")}
            className="mt-1 min-h-32 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between gap-2 bg-surface-2 px-3 py-2">
          <span className="text-xs font-medium text-muted">
            {t("resultCount", { count: output ? output.split("\n").length : 0 })}
          </span>
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-40"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          placeholder={t("outputPlaceholder")}
          className="min-h-32 w-full bg-bg px-3 py-2 text-sm text-text focus:outline-none"
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}