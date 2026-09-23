"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type DiffRow = {
  oldLine: string | null;
  newLine: string | null;
  type: "same" | "added" | "removed";
};

function splitLines(value: string): string[] {
  return value.split(/\r\n|\r|\n/);
}

function alignLines(original: string[], changed: string[]): DiffRow[] {
  const n = original.length;
  const m = changed.length;
  const dp: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const row: number[] = [];
    for (let j = 0; j <= m; j++) row.push(0);
    dp.push(row);
  }
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (original[i] === changed[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }
  const rows: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (original[i] === changed[j]) {
      rows.push({ oldLine: original[i], newLine: changed[j], type: "same" });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ oldLine: original[i], newLine: null, type: "removed" });
      i++;
    } else {
      rows.push({ oldLine: null, newLine: changed[j], type: "added" });
      j++;
    }
  }
  while (i < n) {
    rows.push({ oldLine: original[i], newLine: null, type: "removed" });
    i++;
  }
  while (j < m) {
    rows.push({ oldLine: null, newLine: changed[j], type: "added" });
    j++;
  }
  return rows;
}

export default function MetinKarsilastirici() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");
  const t = useTranslations("comp.metinKarsilastirici");

  const diff = useMemo(() => {
    const originalLines = splitLines(original);
    const changedLines = splitLines(changed);
    return {
      rows: alignLines(originalLines, changedLines),
      originalCount: originalLines.length,
      changedCount: changedLines.length,
    };
  }, [original, changed]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    for (let k = 0; k < diff.rows.length; k++) {
      const row = diff.rows[k];
      if (row.type === "added") added++;
      else if (row.type === "removed") removed++;
      else unchanged++;
    }
    return [
      { key: "total", value: diff.changedCount },
      { key: "added", value: added },
      { key: "removed", value: removed },
      { key: "unchanged", value: unchanged },
    ];
  }, [diff]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="diff-orijinal"
            className="block text-sm font-medium text-text"
          >
            {t("originalLabel")}
          </label>
          <textarea
            id="diff-orijinal"
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
            rows={8}
            spellCheck={false}
            placeholder={t("originalPlaceholder")}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label
            htmlFor="diff-degisen"
            className="block text-sm font-medium text-text"
          >
            {t("changedLabel")}
          </label>
          <textarea
            id="diff-degisen"
            value={changed}
            onChange={(event) => setChanged(event.target.value)}
            rows={8}
            spellCheck={false}
            placeholder={t("changedPlaceholder")}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.key} className="bg-surface px-4 py-3">
            <dt className="text-xs text-muted">{t(stat.key)}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-2 border-b border-border bg-surface-2">
          <div className="px-3.5 py-2 text-xs font-medium text-muted">{t("oldLabel")}</div>
          <div className="border-l border-border px-3.5 py-2 text-xs font-medium text-muted">{t("newLabel")}</div>
        </div>
        {diff.rows.length > 0 ? (
          diff.rows.map((row, index) => {
            const cellBase =
              "min-w-0 whitespace-pre-wrap break-all px-3.5 py-2 font-mono text-xs leading-relaxed";
            const oldBg =
              row.type === "removed"
                ? "bg-warning/15"
                : row.type === "same"
                  ? "bg-surface-2"
                  : "bg-bg";
            const newBg =
              row.type === "added"
                ? "bg-success/15"
                : row.type === "same"
                  ? "bg-surface-2"
                  : "bg-bg";
            return (
              <div key={index} className="grid grid-cols-2">
                <div
                  className={`${cellBase} ${index > 0 ? "border-t border-border" : ""} ${oldBg}`}
                >
                  {row.type === "removed" && (
                    <span className="mr-1 select-none text-danger">−</span>
                  )}
                  <span>{row.oldLine ?? ""}</span>
                </div>
                <div
                  className={`${cellBase} ${index > 0 ? "border-t border-border" : ""} border-l border-border ${newBg}`}
                >
                  {row.type === "added" && (
                    <span className="mr-1 select-none text-success">+</span>
                  )}
                  <span>{row.newLine ?? ""}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="px-3.5 py-3 text-sm text-muted">{t("emptyHint")}</p>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}