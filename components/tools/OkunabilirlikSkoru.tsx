"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function countSyllables(word: string): number {
  const groups = word.match(/[aeiouyıöü]+/g);
  return groups && groups.length > 0 ? groups.length : 1;
}

function levelKey(score: number): string {
  if (score >= 90) return "levelVeryEasy";
  if (score >= 70) return "levelEasy";
  if (score >= 50) return "levelFairlyDifficult";
  return "levelDifficult";
}

export default function OkunabilirlikSkoru() {
  const [text, setText] = useState("");
  const t = useTranslations("comp.okunabilirlikSkoru");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;
    const sentenceCount = trimmed.split(/[.!?…]+(?:\s|$)/).filter((part) => part.trim()).length;
    const normalized = trimmed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const tokens = normalized.split(/[^a-z0-9]+/).filter((part) => part.length > 0);
    if (tokens.length === 0) return null;
    const words = tokens.length;
    const sentences = Math.max(1, sentenceCount);
    let syllables = 0;
    for (let i = 0; i < tokens.length; i++) {
      syllables += countSyllables(tokens[i]);
    }
    const avgWords = words / sentences;
    const avgSyllables = syllables / words;
    const flesch = 206.835 - 1.015 * avgWords - 84.6 * avgSyllables;
    const grade = 0.39 * avgWords + 11.8 * avgSyllables - 15.59;
    return {
      words,
      sentences: sentenceCount,
      syllables,
      avgWords,
      flesch: Math.round(Math.min(100, Math.max(0, flesch))),
      grade: Math.max(0, Math.round(grade * 10) / 10),
    };
  }, [text]);

  return (
    <div>
      <label htmlFor="okunabilirlik-metin" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="okunabilirlik-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={10}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {stats ? (
        <div className="mt-5">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-text">{t("fleschLabel")}</span>
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-accent">
                {stats.flesch}
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${stats.flesch}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-medium text-muted">{t(levelKey(stats.flesch))}</p>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statWords")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
                {stats.words}
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statSentences")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
                {stats.sentences}
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("statSyllables")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
                {stats.syllables}
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{t("avgLabel")}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
                {stats.avgWords.toFixed(1)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between rounded-lg border border-border bg-bg px-4 py-3">
            <span className="text-xs text-muted">{t("gradeLabel")}</span>
            <span className="text-lg font-semibold tabular-nums text-text">
              {stats.grade}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("empty")}</p>
        </div>
      )}
    </div>
  );
}
