"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const ALGORITHMS = ["SHA-256", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function HmacGenerator() {
  const [text, setText] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [result, setResult] = useState<{
    hex: string;
    base64: string;
    digest: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<"hex" | "base64" | null>(null);
  const t = useTranslations("comp.hmacGenerator");

  async function generate() {
    setError("");
    setResult(null);
    if (!text.trim()) {
      setError(t("emptyText"));
      return;
    }
    if (!secret) {
      setError(t("emptySecret"));
      return;
    }
    setBusy(true);
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: algorithm },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(text)
      );
      const digest = await crypto.subtle.digest(
        algorithm,
        encoder.encode(text)
      );
      setResult({
        hex: toHex(signature),
        base64: toBase64(signature),
        digest: toHex(digest),
      });
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  function handleCopy(kind: "hex" | "base64") {
    const value = result?.[kind];
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(kind);
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <label htmlFor="hmac-text" className="block text-sm font-medium text-text">
        {t("textLabel")}
      </label>
      <textarea
        id="hmac-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={4}
        spellCheck={false}
        placeholder={t("textPlaceholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label htmlFor="hmac-secret" className="mt-4 block text-sm font-medium text-text">
        {t("secretLabel")}
      </label>
      <input
        id="hmac-secret"
        type="text"
        value={secret}
        onChange={(event) => setSecret(event.target.value)}
        spellCheck={false}
        placeholder={t("secretPlaceholder")}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label htmlFor="hmac-algo" className="mt-4 block text-sm font-medium text-text">
        {t("algorithmLabel")}
      </label>
      <select
        id="hmac-algo"
        value={algorithm}
        onChange={(event) => setAlgorithm(event.target.value as Algorithm)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {ALGORITHMS.map((algo) => (
          <option key={algo} value={algo}>
            HMAC-{algo}
          </option>
        ))}
      </select>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SampleButton
          onApply={() => {
            setText("The quick brown fox jumps over the lazy dog");
            setSecret("s3cr3t-key");
          }}
        />
        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? t("working") : t("generate")}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {result ? (
        <div className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted">{t("hexLabel")}</span>
              <button
                type="button"
                onClick={() => handleCopy("hex")}
                className="text-xs font-medium text-accent hover:underline"
              >
                {copied === "hex" ? t("copied") : t("copy")}
              </button>
            </div>
            <code className="mt-1 block break-all rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text">
              {result.hex}
            </code>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted">{t("base64Label")}</span>
              <button
                type="button"
                onClick={() => handleCopy("base64")}
                className="text-xs font-medium text-accent hover:underline"
              >
                {copied === "base64" ? t("copied") : t("copy")}
              </button>
            </div>
            <code className="mt-1 block break-all rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text">
              {result.base64}
            </code>
          </div>
          <div>
            <div className="text-xs font-medium text-muted">{t("digestLabel")}</div>
            <code className="mt-1 block break-all rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text">
              {result.digest}
            </code>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}