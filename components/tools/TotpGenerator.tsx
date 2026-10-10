"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function cleanSecret(input: string): string {
  return input.toUpperCase().replace(/[^A-Z2-7]/g, "");
}

function base32Decode(input: string): Uint8Array {
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of input) {
    const index = BASE32.indexOf(char);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

function hotp(key: Uint8Array, counter: number): Promise<ArrayBuffer> {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, 0);
  view.setUint32(4, counter >>> 0);
  const keyBuffer = key.buffer as ArrayBuffer;
  return crypto.subtle
    .importKey("raw", keyBuffer, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])
    .then((cryptoKey) => crypto.subtle.sign("HMAC", cryptoKey, buf));
}

export default function TotpGenerator() {
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("------");
  const [remaining, setRemaining] = useState(0);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.totpGenerator");

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor(Date.now() / 1000);
      setRemaining(30 - (seconds % 30));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const raw = cleanSecret(secret);
    if (raw.length < 10) {
      setCode("------");
      return;
    }
    const key = base32Decode(raw);
    if (key.length === 0) {
      setCode("------");
      return;
    }
    const update = () => {
      const counter = Math.floor(Date.now() / 1000 / 30);
      hotp(key, counter).then((result) => {
        if (cancelled) return;
        const arr = new Uint8Array(result);
        const offset = arr[arr.length - 1] & 0x0f;
        const bin =
          ((arr[offset] & 0x7f) << 24) |
          (arr[offset + 1] << 16) |
          (arr[offset + 2] << 8) |
          arr[offset + 3];
        setCode(String(bin % 1000000).padStart(6, "0"));
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [secret]);

  async function copyCode() {
    if (code === "------") return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function clear() {
    setSecret("");
    setCopied(false);
  }

  const progress = (remaining / 30) * 100;

  return (
    <div>
      <label
        htmlFor="totp-secret"
        className="block text-sm font-medium text-text"
      >
        {t("secretLabel")}
      </label>
      <input
        id="totp-secret"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={secret}
        onChange={(event) => setSecret(event.target.value)}
        placeholder={t("secretPlaceholder")}
        className="mt-2 w-full max-w-md rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {cleanSecret(secret).length >= 10 ? (
        <div className="mt-6 max-w-md rounded-lg border border-border bg-surface p-5">
          <p className="text-xs text-muted">{t("codeLabel")}</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="font-mono text-4xl font-bold tabular-nums tracking-widest text-text">
              {code}
            </span>
            <span className="text-xs tabular-nums text-muted">
              {remaining}s
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={copyCode}
          disabled={code === "------"}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={!secret}
          className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}