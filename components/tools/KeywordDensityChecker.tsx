"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

type Row = { word: string; count: number; density: number; bar: number };

function tokenize(value: string): string[] {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return normalized.split(/[^a-z0-9]+/).filter((part) => part.length > 0);
}

export default function KeywordDensityChecker() {
  const [text, setText] = useState("");
  const [minLength, setMinLength] = useState(3);
  const t = useTranslations("comp.keywordDensityChecker");

  const analysis = useMemo(() => {
    const tokens = tokenize(text);
    const totalWords = tokens.length;
    const counts = new Map<string, number>();
    tokens.forEach((word) => {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    });
    const uniqueWords = counts.size;
    const max = Math.max(0, ...Array.from(counts.values()));
    const rows: Row[] = [];
    counts.forEach((count, word) => {
      if (word.length >= minLength) {
        rows.push({
          word,
          count,
          density: totalWords > 0 ? (count / totalWords) * 100 : 0,
          bar: max > 0 ? (count / max) * 100 : 0,
        });
      }
    });
    rows.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
    return { totalWords, uniqueWords, rows: rows.slice(0, 20) };
  }, [text, minLength]);

  return (
    <div>
      <label htmlFor="anahtar-metin" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="anahtar-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["keyword-density-checker"])} />
      </div>

      <label
        htmlFor="anahtar-min"
        className="mt-4 block text-sm font-medium text-text"
      >
        {t("minLength")}
      </label>
      <input
        id="anahtar-min"
        type="number"
        min={1}
        max={20}
        value={minLength}
        onChange={(event) => {
          const next = Number(event.target.value);
          setMinLength(Number.isFinite(next) ? Math.max(1, next) : 1);
        }}
        className="mt-2 w-28 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        <div className="bg-surface px-4 py-3">
          <dt className="text-xs text-muted">{t("totalWords")}</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
            {analysis.totalWords}
          </dd>
        </div>
        <div className="bg-surface px-4 py-3">
          <dt className="text-xs text-muted">{t("uniqueWords")}</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
            {analysis.uniqueWords}
          </dd>
        </div>
        <div className="bg-surface px-4 py-3">
          <dt className="text-xs text-muted">{t("topWords")}</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
            {analysis.rows.length}
          </dd>
        </div>
      </dl>

      {analysis.rows.length > 0 ? (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-2 text-xs font-medium text-muted">
            <span>{t("thWord")}</span>
            <span className="flex gap-6">
              <span className="w-14 text-right">{t("thCount")}</span>
              <span className="w-20 text-right">{t("thDensity")}</span>
            </span>
          </div>
          <ul>
            {analysis.rows.map((row) => (
              <li key={row.word} className="border-b border-border py-2.5 last:border-b-0">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-text">{row.word}</span>
                  <span className="flex shrink-0 gap-6 tabular-nums">
                    <span className="w-14 text-right text-muted">{row.count}</span>
                    <span className="w-20 text-right text-accent">
                      {row.density.toFixed(2)}%
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${row.bar}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("empty")}</p>
        </div>
      )}
    </div>
  );
}
