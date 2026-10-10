"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function bigrams(text: string): string[] {
  const chars = text.toLowerCase().replace(/\s+/g, " ").trim();
  const grams: string[] = [];
  for (let i = 0; i < chars.length - 1; i += 1) {
    grams.push(chars.slice(i, i + 2));
  }
  return grams;
}

function diceSimilarity(a: string, b: string): number {
  const ga = bigrams(a);
  const gb = bigrams(b);
  if (ga.length === 0 || gb.length === 0) return 0;
  const setB = new Map<string, number>();
  for (const gram of gb) setB.set(gram, (setB.get(gram) ?? 0) + 1);
  let overlap = 0;
  for (const gram of ga) {
    const count = setB.get(gram) ?? 0;
    if (count > 0) {
      overlap += 1;
      setB.set(gram, count - 1);
    }
  }
  return (2 * overlap) / (ga.length + gb.length);
}

export default function PlagiarismChecker() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const t = useTranslations("comp.plagiarismChecker");

  function clear() {
    setText1("");
    setText2("");
  }

  const similarity = useMemo(() => diceSimilarity(text1, text2), [text1, text2]);
  const percent = Math.round(similarity * 100);

  const level =
    percent >= 75
      ? "veryHigh"
      : percent >= 50
        ? "high"
        : percent >= 25
          ? "medium"
          : "low";

  const color =
    percent >= 75
      ? "text-red-600"
      : percent >= 50
        ? "text-amber-600"
        : percent >= 25
          ? "text-yellow-600"
          : "text-emerald-600";

  const textareaClass =
    "mt-2 h-40 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 sm:h-52";

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="plag-text1" className="block text-sm font-medium text-text">
            {t("text1")}
          </label>
          <textarea
            id="plag-text1"
            value={text1}
            onChange={(event) => setText1(event.target.value)}
            className={textareaClass}
          />
        </div>
        <div>
          <label htmlFor="plag-text2" className="block text-sm font-medium text-text">
            {t("text2")}
          </label>
          <textarea
            id="plag-text2"
            value={text2}
            onChange={(event) => setText2(event.target.value)}
            className={textareaClass}
          />
        </div>
      </div>

      {percent > 0 ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted">{t("similarity")}</span>
            <span className={`text-2xl font-bold ${color}`}>%{percent}</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${percent}%`,
                backgroundColor:
                  percent >= 75 ? "#dc2626" : percent >= 50 ? "#d97706" : "#059669",
              }}
            />
          </div>
          <p className="mt-3 text-sm font-medium text-text">{t(level)}</p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">{t("waiting")}</p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={clear}
          disabled={!text1 && !text2}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}