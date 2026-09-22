"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function md5Hex(input: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    let c = input.charCodeAt(i);
    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c >= 0xd800 && c <= 0xdbff && i + 1 < input.length) {
      const c2 = input.charCodeAt(i + 1);
      if (c2 >= 0xdc00 && c2 <= 0xdfff) {
        c = 0x10000 + ((c & 0x3ff) << 10) + (c2 & 0x3ff);
        i++;
        bytes.push(
          0xf0 | (c >> 18),
          0x80 | ((c >> 12) & 0x3f),
          0x80 | ((c >> 6) & 0x3f),
          0x80 | (c & 0x3f)
        );
      } else {
        bytes.push(0xef, 0xbf, 0xbd);
      }
    } else if (c >= 0xdc00 && c <= 0xdfff) {
      bytes.push(0xef, 0xbf, 0xbd);
    } else {
      bytes.push(
        0xe0 | (c >> 12),
        0x80 | ((c >> 6) & 0x3f),
        0x80 | (c & 0x3f)
      );
    }
  }

  const low = bytes.length * 8;
  const high = Math.floor(low / 0x100000000);
  const totalLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const msg = new Uint8Array(totalLen);
  msg.set(bytes);
  msg[bytes.length] = 0x80;
  const view = new DataView(msg.buffer);
  view.setUint32(totalLen - 8, low >>> 0, true);
  view.setUint32(totalLen - 4, high >>> 0, true);

  const shifts = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const constant = [];
  for (let i = 0; i < 64; i++) {
    constant[i] =
      Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) & 0xffffffff;
  }

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < totalLen; offset += 64) {
    const chunk = [];
    for (let i = 0; i < 16; i++) {
      chunk[i] = view.getUint32(offset + i * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      f = (f + a + constant[i] + chunk[g]) | 0;
      a = d;
      d = c;
      c = b;
      b = (b + ((f << shifts[i]) | (f >>> (32 - shifts[i])))) | 0;
    }

    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  let hex = "";
  for (const word of [a0, b0, c0, d0]) {
    for (let shift = 0; shift < 32; shift += 8) {
      hex += ((word >>> shift) & 0xff).toString(16).padStart(2, "0");
    }
  }
  return hex;
}

export default function Md5Hash() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.md5Hash");

  const hash = useMemo(() => md5Hex(text), [text]);

  async function copyDigest() {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label htmlFor="md5-metin" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="md5-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-5 rounded-lg border border-border bg-bg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {t("hashLabel")}
            </p>
            <p
              className={`mt-1 break-all font-mono text-xs leading-relaxed sm:text-sm ${
                text ? "text-text" : "text-faint"
              }`}
            >
              {text ? hash : t("empty")}
            </p>
          </div>
          <button
            type="button"
            onClick={copyDigest}
            disabled={!text}
            className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </div>
    </div>
  );
}