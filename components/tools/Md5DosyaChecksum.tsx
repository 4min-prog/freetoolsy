"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const MD5_S = new Uint8Array([
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
]);

const MD5_K = (() => {
  const table = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    table[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
  }
  return table;
})();

function md5Bytes(input: Uint8Array): string {
  const originalLength = input.length;
  const bitLength = originalLength * 8;
  const paddedLength = (((originalLength + 8) >> 6) + 1) * 64;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(input);
  buffer[originalLength] = 0x80;
  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const m = new Uint32Array(16);
  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i++) {
      m[i] = view.getUint32(offset + i * 4, true);
    }
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for (let i = 0; i < 64; i++) {
      let F = 0;
      let g = 0;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + MD5_K[i] + m[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      const shift = MD5_S[i];
      B = (B + ((F << shift) | (F >>> (32 - shift)))) >>> 0;
    }
    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }
  const out = new Uint8Array(16);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, a0, true);
  outView.setUint32(4, b0, true);
  outView.setUint32(8, c0, true);
  outView.setUint32(12, d0, true);
  let hex = "";
  for (let i = 0; i < 16; i++) hex += out[i].toString(16).padStart(2, "0");
  return hex;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

export default function Md5DosyaChecksum() {
  const [fileName, setFileName] = useState("");
  const [sizeText, setSizeText] = useState("");
  const [digest, setDigest] = useState("");
  const [hashing, setHashing] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.md5Dosya");

  const canCopy = useMemo(() => digest.length > 0 && !hashing, [digest, hashing]);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setFileName(file.name);
    setSizeText(formatSize(file.size));
    setDigest("");
    setCopied(false);
    setHashing(true);
    window.setTimeout(() => {
      file
        .arrayBuffer()
        .then((buffer) => {
          setDigest(md5Bytes(new Uint8Array(buffer)));
        })
        .catch(() => {
          setDigest("");
        })
        .finally(() => {
          setHashing(false);
        });
    }, 0);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(digest);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="md5-dosya"
        className="inline-block cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("label")}
      </label>
      <input
        id="md5-dosya"
        type="file"
        onChange={handleFile}
        className="hidden"
      />

      {fileName && (
        <div className="mt-5 rounded-lg border border-border bg-bg p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="shrink-0 text-muted">{t("fileName")}</span>
            <span className="min-w-0 truncate text-text">{fileName}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
            <span className="shrink-0 text-muted">{t("size")}</span>
            <span className="shrink-0 tabular-nums text-text">{sizeText}</span>
          </div>
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs text-muted">{t("digest")}</p>
            <div className="mt-1 flex items-start justify-between gap-3">
              {hashing ? (
                <p className="text-sm text-muted">{t("hashing")}</p>
              ) : (
                <p className="min-w-0 break-all font-mono text-xs leading-relaxed text-text sm:text-sm">
                  {digest || "…"}
                </p>
              )}
              <button
                type="button"
                onClick={copy}
                disabled={!canCopy}
                className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
              >
                {copied ? t("copied") : t("copy")}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}