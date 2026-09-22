"use client";

import { useMemo, useState } from "react";

export default function KelimeSayaci() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const sentences = trimmed
      ? trimmed.split(/[.!?…]+(?:\s|$)/).filter((part) => part.trim()).length
      : 0;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const avgWord =
      words.length > 0 ? charsNoSpace / words.length : 0;
    const readingMinutes = words.length > 0 ? Math.max(1, Math.ceil(words.length / 200)) : 0;

    return [
      { label: "Kelime", value: words.length },
      { label: "Cümle", value: sentences },
      { label: "Karakter (boşluksuz)", value: charsNoSpace },
      {
        label: "Ortalama kelime uzunluğu",
        value: avgWord > 0 ? avgWord.toFixed(1) : "0",
      },
      {
        label: "Tahmini okuma süresi",
        value: readingMinutes > 0 ? `${readingMinutes} dk` : "0 dk",
      },
    ];
  }, [text]);

  return (
    <div>
      <label htmlFor="kelime-metin" className="block text-sm font-medium text-text">
        Metninizi girin
      </label>
      <textarea
        id="kelime-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder="Buraya yazın veya yapıştırın…"
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface px-4 py-3">
            <dt className="text-xs text-muted">{stat.label}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
