"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const t = useTranslations("comp.characterCounter");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const sentences = trimmed
      ? trimmed.split(/[.!?…]+(?:\s|$)/).filter((part) => part.trim()).length
      : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0;
    return [
      { key: "chars", value: chars },
      { key: "noSpace", value: charsNoSpace },
      { key: "words", value: words },
      { key: "lines", value: lines },
      { key: "sentences", value: sentences },
      { key: "paragraphs", value: paragraphs },
    ];
  }, [text]);

  return (
    <div>
      <label
        htmlFor="karakter-metin"
        className="block text-sm font-medium text-text"
      >
        {t("label")}
      </label>
      <textarea
        id="karakter-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["character-counter"])} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.key} className="bg-surface px-4 py-3">
            <dt className="text-xs text-muted">{t(stat.key)}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}