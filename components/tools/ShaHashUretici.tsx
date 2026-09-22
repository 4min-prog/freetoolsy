"use client";

import { useEffect, useState } from "react";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-512"];

export default function ShaHashUretici() {
  const [text, setText] = useState("");
  const [algo, setAlgo] = useState<string>("SHA-256");
  const [digest, setDigest] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function compute() {
      const encoder = new TextEncoder();
      const buffer = await crypto.subtle.digest(algo, encoder.encode(text));
      if (cancelled) return;
      const bytes = new Uint8Array(buffer);
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
      }
      setDigest(hex);
    }
    compute();
    return () => {
      cancelled = true;
    };
  }, [text, algo]);

  function copyDigest() {
    navigator.clipboard
      .writeText(digest)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <label
        htmlFor="sha-metin"
        className="block text-sm font-medium text-text"
      >
        Metninizi girin
      </label>
      <textarea
        id="sha-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={5}
        placeholder="Özeti hesaplanacak metin buraya yazılır"
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label
        htmlFor="sha-algoritma"
        className="mt-5 block text-sm font-medium text-text"
      >
        Algoritma
      </label>
      <select
        id="sha-algoritma"
        value={algo}
        onChange={(event) => setAlgo(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none sm:w-auto"
      >
        {ALGORITHMS.map((algorithm) => (
          <option key={algorithm} value={algorithm}>
            {algorithm}
          </option>
        ))}
      </select>

      <div className="mt-5 rounded-lg border border-border bg-bg p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 break-all font-mono text-xs leading-relaxed text-text sm:text-sm">
            {digest || "…"}
          </p>
          <button
            type="button"
            onClick={copyDigest}
            disabled={!digest}
            className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
          >
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Metniniz hesaplama sırasında tarayıcınızdan çıkmaz. SHA özetleri tek
        yönlüdür; okuyup özgün metni geri üretemezsiniz. SHA-1 günümüzde
        güvenli kabul edilmez ve yalnızca uyumluluk amaçlıdır.
      </p>
    </div>
  );
}