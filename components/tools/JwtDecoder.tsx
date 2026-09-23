"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

function base64UrlDecode(value: string): string {
  let base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((char) =>
        `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`
      )
      .join("")
  );
}

type Decoded = {
  header: string;
  payload: string;
  signature: string;
};

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<Decoded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("comp.jwt");

  function decodeToken() {
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setResult(null);
      setError(t("invalid"));
      return;
    }
    try {
      const header = JSON.stringify(
        JSON.parse(base64UrlDecode(parts[0])),
        null,
        2
      );
      const payload = JSON.stringify(
        JSON.parse(base64UrlDecode(parts[1])),
        null,
        2
      );
      setResult({ header, payload, signature: parts[2] });
      setError(null);
    } catch {
      setResult(null);
      setError(t("invalid"));
    }
  }

  return (
    <div>
      <label htmlFor="jwt-token" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="jwt-token"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        rows={4}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setToken(SAMPLES["jwt-cozucu"])} />
      </div>

      <button
        type="button"
        onClick={decodeToken}
        className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("decode")}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { label: t("headerLabel"), value: result.header },
            { label: t("payloadLabel"), value: result.payload },
            { label: t("signatureLabel"), value: result.signature },
          ].map((section) => (
            <div key={section.label} className="min-w-0 rounded-xl border border-border bg-surface p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {section.label}
              </p>
              <pre className="mt-2 max-h-56 overflow-auto break-all whitespace-pre-wrap rounded-lg border border-border bg-bg p-3 font-mono text-xs leading-relaxed text-text">
                {section.value}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}