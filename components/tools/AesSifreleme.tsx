"use client";

import { showToast } from "@/lib/toast";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const ITERATIONS = 100000;

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  usage: "encrypt" | "decrypt"
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const material = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
}

async function encryptText(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, "encrypt");
  const cipher = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(plaintext)
    )
  );
  return toBase64(salt) + "." + toBase64(iv) + "." + toBase64(cipher);
}

async function decryptText(value: string, password: string): Promise<string> {
  const parts = value.split(".");
  if (parts.length !== 3) throw new Error("INVALID_FORMAT");
  let salt: Uint8Array<ArrayBuffer>;
  let iv: Uint8Array<ArrayBuffer>;
  let cipher: Uint8Array<ArrayBuffer>;
  try {
    salt = fromBase64(parts[0]);
    iv = fromBase64(parts[1]);
    cipher = fromBase64(parts[2]);
  } catch {
    throw new Error("INVALID_FORMAT");
  }
  if (salt.length === 0 || iv.length === 0 || cipher.length === 0) {
    throw new Error("INVALID_FORMAT");
  }
  const key = await deriveKey(password, salt, "decrypt");
  const plaintext = new Uint8Array(
    await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher)
  );
  return new TextDecoder().decode(plaintext);
}

export default function AesSifreleme() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.aesSifreleme");

  function switchMode(next: "encrypt" | "decrypt") {
    setMode(next);
    setOutput("");
    setError(null);
    setCopied(false);
  }

  async function run() {
    if (!password || !input.trim()) {
      setOutput("");
      setError(t("emptyError"));
      setCopied(false);
      return;
    }
    if (typeof crypto === "undefined" || !crypto.subtle) {
      setOutput("");
      setError(t("unavailable"));
      setCopied(false);
      return;
    }
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      if (mode === "encrypt") {
        setOutput(await encryptText(input, password));
      } else {
        setOutput(await decryptText(input.trim(), password));
      }
    } catch (err) {
      setOutput("");
      if (err instanceof Error && err.message === "INVALID_FORMAT") {
        setError(t("invalidFormat"));
      } else if (mode === "decrypt") {
        setError(t("decryptFailed"));
      } else {
        setError(t("failed"));
      }
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const isDecrypt = mode === "decrypt";

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("modeAria")}
        className="flex gap-1 rounded-lg border border-border bg-surface-2 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!isDecrypt}
          onClick={() => switchMode("encrypt")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "encrypt" ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
          }`}
        >
          {t("modeEncrypt")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isDecrypt}
          onClick={() => switchMode("decrypt")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "decrypt" ? "bg-surface text-text shadow-card" : "text-muted hover:text-text"
          }`}
        >
          {t("modeDecrypt")}
        </button>
      </div>

      <label
        htmlFor="aes-sifre"
        className="mt-5 block text-sm font-medium text-text"
      >
        {t("passwordLabel")}
      </label>
      <input
        id="aes-sifre"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder={t("passwordPlaceholder")}
        autoComplete="off"
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label
        htmlFor="aes-girdi"
        className="mt-5 block text-sm font-medium text-text"
      >
        {isDecrypt ? t("cipherLabel") : t("plainLabel")}
      </label>
      <textarea
        id="aes-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={7}
        spellCheck={false}
        placeholder={isDecrypt ? t("cipherPlaceholder") : t("plainPlaceholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["aes-sifreleme"])} />
      </div>

      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="mt-3 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {isDecrypt ? t("modeDecrypt") : t("modeEncrypt")}
      </button>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-strong bg-surface-2 px-3.5 py-2.5 text-sm text-text"
        >
          {error}
        </p>
      ) : null}

      {output ? (
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
          <textarea
            value={output}
            readOnly
            rows={6}
            spellCheck={false}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}