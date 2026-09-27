"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function isWordChar(code: number): boolean {
  return (
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    (code >= 48 && code <= 57) ||
    (code >= 0xc0 && code <= 0x24f) ||
    (code >= 0x370 && code <= 0x4ff) ||
    (code >= 0x590 && code <= 0x6ff) ||
    (code >= 0x2e80 && code <= 0x9fff)
  );
}

function countWords(text: string): number {
  let count = 0;
  let inWord = false;
  for (const char of Array.from(text)) {
    const word = isWordChar(char.codePointAt(0) ?? 0);
    if (word && !inWord) {
      count++;
      inWord = true;
    } else if (!word) {
      inWord = false;
    }
  }
  return count;
}

export default function ReadingTimeCalculator() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState("200");
  const t = useTranslations("comp.readingTimeCalculator");

  const words = useMemo(() => countWords(text), [text]);

  const speed = Number(wpm) || 0;
  const minutes = speed > 0 ? words / speed : 0;
  const reading = minutes > 0 ? Math.max(1, Math.round(minutes)) : 0;

  let label = "";
  if (minutes < 0.5) label = t("underMin");
  else if (minutes < 60) label = `${reading} ${t("minRead")}`;
  else {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    label = `${h} ${t("hr")} ${m} ${t("min")}`;
  }

  return (
    <div>
      <label
        htmlFor="read-input"
        className="block text-sm font-medium text-text"
      >
        {t("inputLabel")}
      </label>
      <textarea
        id="read-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="mt-2 h-40 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label
        htmlFor="read-wpm"
        className="mt-4 block text-sm font-medium text-text"
      >
        {t("wpmLabel")}
      </label>
      <input
        id="read-wpm"
        type="number"
        min={20}
        max={600}
        value={wpm}
        onChange={(event) => setWpm(event.target.value)}
        className="mt-2 w-full max-w-xs rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {text.length > 0 ? (
        <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted">{t("words")}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-text">
              {words}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted">{t("time")}</p>
            <p className="mt-1 text-xl font-semibold text-text">{label}</p>
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}