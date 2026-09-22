"use client";

import { useState } from "react";

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decodeBase64(text: string): string {
  const binary = atob(text);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function encode() {
    setError(null);
    setOutput(encodeBase64(input));
  }

  function decode() {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Önce Base64 verisi girin.");
      setOutput("");
      return;
    }
    try {
      setError(null);
      setOutput(decodeBase64(trimmed));
    } catch {
      setError("Geçersiz Base64 verisi.");
      setOutput("");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="base64-girdi"
        className="block text-sm font-medium text-text"
      >
        Girdi
      </label>
      <textarea
        id="base64-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={6}
        spellCheck={false}
        placeholder="Metin veya Base64 verisi…"
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={encode}
          disabled={!input}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Encode
        </button>
        <button
          type="button"
          onClick={decode}
          disabled={!input}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          Decode
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="base64-cikti"
            className="text-sm font-medium text-text"
          >
            Çıktı
          </label>
          <button
            type="button"
            onClick={copy}
            disabled={!output}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
          >
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
        <textarea
          id="base64-cikti"
          readOnly
          value={output}
          rows={6}
          spellCheck={false}
          placeholder="Sonuç burada görünecek…"
          className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
    </div>
  );
}