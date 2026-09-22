"use client";

import { useMemo, useState } from "react";

export default function KarakterSayaci() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const paragraphs = text.trim()
      ? text.trim().split(/\n\s*\n/).length
      : 0;
    return [
      { label: "Karakter", value: chars },
      { label: "Boşluksuz karakter", value: charsNoSpace },
      { label: "Kelime", value: words },
      { label: "Satır", value: lines },
      { label: "Paragraf", value: paragraphs },
    ];
  }, [text]);

  return (
    <div>
      <label
        htmlFor="karakter-metin"
        className="block text-sm font-medium text-text"
      >
        Metninizi girin
      </label>
      <textarea
        id="karakter-metin"
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
