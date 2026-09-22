"use client";

import { useState } from "react";

const TRANSFORMS = [
  {
    key: "upper",
    label: "BÜYÜK HARF",
    apply: (value: string) => value.toLocaleUpperCase("tr-TR"),
  },
  {
    key: "lower",
    label: "küçük harf",
    apply: (value: string) => value.toLocaleLowerCase("tr-TR"),
  },
  {
    key: "title",
    label: "İlk Harf Büyük",
    apply: (value: string) =>
      value
        .split(/(\s+)/)
        .map((part) =>
          /^\s+$/.test(part) || part === ""
            ? part
            : part.charAt(0).toLocaleUpperCase("tr-TR") +
              part.slice(1).toLocaleLowerCase("tr-TR")
        )
        .join(""),
  },
  {
    key: "invert",
    label: "tERSİNE ÇEVİR",
    apply: (value: string) =>
      Array.from(value)
        .map((char) =>
          char === char.toLocaleLowerCase("tr-TR")
            ? char.toLocaleUpperCase("tr-TR")
            : char.toLocaleLowerCase("tr-TR")
        )
        .join(""),
  },
] as const;

export default function HarfDonusturucu() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="harf-metin"
        className="block text-sm font-medium text-text"
      >
        Metninizi girin
      </label>
      <textarea
        id="harf-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder="Buraya yazın veya yapıştırın…"
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {TRANSFORMS.map((transform) => (
          <button
            key={transform.key}
            type="button"
            onClick={() => setText(transform.apply(text))}
            disabled={!text}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {transform.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={copy}
        disabled={!text}
        className="mt-4 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
      >
        {copied ? "Kopyalandı" : "Kopyala"}
      </button>
    </div>
  );
}