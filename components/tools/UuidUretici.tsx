"use client";

import { useEffect, useState } from "react";

function makeUuid(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const COUNTS = [1, 2, 5, 10, 20];

export default function UuidUretici() {
  const [count, setCount] = useState(5);
  const [items, setItems] = useState<string[]>([]);
  const [version, setVersion] = useState(4);
  const [copied, setCopied] = useState<string | null>(null);

  const regenerate = () => {
    const next: string[] = [];
    for (let i = 0; i < count; i++) next.push(makeUuid());
    setItems(next);
    setCopied(null);
  };

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  function copyItem(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(value);
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => undefined);
  }

  function copyAll() {
    if (!items.length) return;
    navigator.clipboard
      .writeText(items.join("\n"))
      .then(() => {
        setCopied("all");
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="uuid-adet" className="block text-sm font-medium text-text">
            Adet
          </label>
          <select
            id="uuid-adet"
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="mt-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            {COUNTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="uuid-versiyon" className="block text-sm font-medium text-text">
            Versiyon
          </label>
          <select
            id="uuid-versiyon"
            value={version}
            onChange={(event) => setVersion(Number(event.target.value))}
            className="mt-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            <option value={4}>v4 (rastgele)</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={regenerate}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        Yeni UUID&apos;ler üret
      </button>

      {items.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text">Üretilen kimlikler</p>
            <button
              type="button"
              onClick={copyAll}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied === "all" ? "Kopyalandı" : "Tümünü kopyala"}
            </button>
          </div>
          <ol className="mt-3 space-y-2">
            {items.map((item, index) => (
              <li
                key={item}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-3.5 py-2.5"
              >
                <span className="min-w-0 break-all font-mono text-xs leading-relaxed text-text sm:text-sm">
                  {index + 1}. {item}
                </span>
                <button
                  type="button"
                  onClick={() => copyItem(item)}
                  className="shrink-0 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
                >
                  {copied === item ? "Kopyalandı" : "Kopyala"}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        UUID v4, tarayıcınızın kriptografik rastgelelik kaynağıyla üretilir.
        Her değer evrensel olarak benzersiz kabul edilir; aynı değerin iki kez
        çıkma olasılığı pratikte sıfırdır.
      </p>
    </div>
  );
}