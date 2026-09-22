"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function AiTokenHesaplayici() {
  const [text, setText] = useState("");
  const t = useTranslations("comp.aiToken");

  const stats = useMemo(() => {
    const chars = text.length;
    const tokens = Math.max(1, Math.ceil(chars / 2.5));
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    return [
      { key: "tokens", value: tokens },
      { key: "chars", value: chars },
      { key: "words", value: words },
      { key: "lines", value: lines },
    ];
  }, [text]);

  return (
    <div>
      <label
        htmlFor="ai-token-metin"
        className="block text-sm font-medium text-text"
      >
        {t("label")}
      </label>
      <textarea
        id="ai-token-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.key} className="bg-surface px-4 py-3">
            <dt className="text-xs text-muted">{t(stat.key)}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
              {stat.value.toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}