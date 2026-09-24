"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

export default function WordCounter() {
  const [text, setText] = useState("");
  const t = useTranslations("comp.wordCounter");
  const locale = useLocale();

  const { stats, topWords } = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const sentences = trimmed
      ? trimmed.split(/[.!?…]+(?:\s|$)/).filter((part) => part.trim()).length
      : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0;
    const chars = text.length;
    const readingMinutes =
      words.length > 0 ? Math.max(1, Math.ceil(words.length / 200)) : 0;

    const counts = new Map<string, number>();
    for (const raw of words) {
      const word = raw
        .toLocaleLowerCase(locale)
        .replace(/^[^\wçÇğĞıİöÖşŞüÜ]+|[^\wçÇğĞıİöÖşŞüÜ]+$/g, "");
      if (!word) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    const uniqueWords = Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    );

    return {
      stats: [
        { key: "words", value: words.length },
        { key: "chars", value: chars },
        { key: "sentences", value: sentences },
        { key: "paragraphs", value: paragraphs },
        { key: "readingTime", value: readingMinutes },
      ],
      topWords: uniqueWords.slice(0, 5),
    };
  }, [text, locale]);

  return (
    <div>
      <label htmlFor="kelime-metin" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="kelime-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["word-counter"])} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.key} className="bg-surface px-4 py-3">
            <dt className="text-xs text-muted">{t(stat.key)}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
              {stat.key === "readingTime"
                ? t("readingMinutes", { minutes: stat.value })
                : stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {topWords.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-text">{t("topWords")}</p>
          <ol className="mt-2 grid gap-2 sm:grid-cols-2">
            {topWords.map(([word, count], index) => (
              <li
                key={word}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="w-5 shrink-0 text-xs tabular-nums text-faint">
                    {index + 1}.
                  </span>
                  <span className="truncate text-text">{word}</span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted">
                  {count}×
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}