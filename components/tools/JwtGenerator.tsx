"use client";

import { showToast } from "@/lib/toast";

import { useState } from "react";
import { useTranslations } from "next-intl";

const DEFAULT_HEADER = '{\n  "alg": "HS256",\n  "typ": "JWT"\n}';

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function textToBase64Url(value: string): string {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

export default function JwtGenerator() {
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe"\n}');
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [steps, setSteps] = useState<
    { header: string; payload: string; signature: string } | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.jwtGenerator");

  async function generate() {
    if (!secret) {
      setToken("");
      setSteps(null);
      setError(t("secretError"));
      return;
    }
    let parsedHeader: unknown;
    let parsedPayload: unknown;
    try {
      parsedHeader = JSON.parse(header);
    } catch {
      setToken("");
      setSteps(null);
      setError(t("invalidHeader"));
      return;
    }
    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      setToken("");
      setSteps(null);
      setError(t("invalidPayload"));
      return;
    }
    if (
      typeof parsedHeader !== "object" ||
      parsedHeader === null ||
      typeof parsedPayload !== "object" ||
      parsedPayload === null
    ) {
      setToken("");
      setSteps(null);
      setError(t("invalidPayload"));
      return;
    }
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      if (typeof crypto === "undefined" || !crypto.subtle) throw new Error("unavailable");
      const headerPart = textToBase64Url(JSON.stringify(parsedHeader));
      const payloadPart = textToBase64Url(JSON.stringify(parsedPayload));
      const signed = headerPart + "." + payloadPart;
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(signed)
      );
      const signaturePart = bytesToBase64Url(new Uint8Array(signature));
      setSteps({ header: headerPart, payload: payloadPart, signature: signaturePart });
      setToken(signed + "." + signaturePart);
    } catch {
      setToken("");
      setSteps(null);
      setError(t("unavailable"));
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="jwt-uretici-header" className="block text-sm font-medium text-text">
            {t("headerLabel")}
          </label>
          <textarea
            id="jwt-uretici-header"
            value={header}
            onChange={(event) => setHeader(event.target.value)}
            rows={5}
            spellCheck={false}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="jwt-uretici-payload" className="block text-sm font-medium text-text">
            {t("payloadLabel")}
          </label>
          <textarea
            id="jwt-uretici-payload"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            rows={5}
            spellCheck={false}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <label htmlFor="jwt-uretici-secret" className="mt-5 block text-sm font-medium text-text">
        {t("secretLabel")}
      </label>
      <input
        id="jwt-uretici-secret"
        type="password"
        value={secret}
        onChange={(event) => setSecret(event.target.value)}
        autoComplete="off"
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <button
        type="button"
        onClick={generate}
        disabled={busy}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {t("generate")}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text"
        >
          {error}
        </p>
      )}

      {steps ? (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-text">{t("outputLabel")}</p>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <p className="mt-2 break-all rounded-lg border border-border bg-bg p-3.5 font-mono text-xs leading-relaxed text-text">
            {token}
          </p>
          <p className="mt-4 text-sm font-medium text-text">{t("stepsLabel")}</p>
          <div className="mt-2 overflow-hidden rounded-lg border border-border">
            {[
              { label: t("headerLabel"), value: steps.header },
              { label: t("payloadLabel"), value: steps.payload },
              { label: t("signatureLabel"), value: steps.signature },
            ].map((step, index) => (
              <div
                key={step.label}
                className="flex items-start justify-between gap-3 border-t border-border bg-surface px-4 py-2.5 first:border-t-0"
              >
                <span className="shrink-0 text-xs font-medium text-muted">
                  {index + 1 + ". " + step.label}
                </span>
                <span className="min-w-0 break-all text-right font-mono text-xs text-text">
                  {step.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}