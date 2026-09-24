"use client";

import { showToast } from "@/lib/toast";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";
import QRCode from "react-qr-code";

const LETTERS: string[] = "abcdefghijklmnopqrstuvwxyz".split("");
const DIGITS: string[] = "0123456789".split("");

function classChars(): string[] {
  return LETTERS.concat(DIGITS);
}

function randomString(length: number): string {
  const pool = classChars();
  const chars: string[] = [];
  for (let i = 0; i < length; i++) {
    chars.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return chars.join("");
}

export default function QrCodeGenerator() {
  const [text, setText] = useState(randomString(8));
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.qrCodeGenerator");

  function downloadPng() {
    const svg = document.querySelector("#qr-svg-wrap svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(
      new Blob([data], { type: "image/svg+xml;charset=utf-8" })
    );
    const img = new Image();
    img.onload = () => {
      const size = 720;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const link = document.createElement("a");
        link.download = "freetoolsy-qr.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        showToast("download");
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function copyText(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true); showToast();
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  const hasText = text.trim().length > 0;

  return (
    <div>
      <label
        htmlFor="qr-metin"
        className="block text-sm font-medium text-text"
      >
        {t("label")}
      </label>
      <textarea
        id="qr-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={500}
        rows={4}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <p className="mt-1.5 text-right text-xs tabular-nums text-faint">
        {t("charCount", { count: text.length })}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["qr-code-generator"])} />
      </div>

      <div
        id="qr-svg-wrap"
        className="mt-4 flex justify-center rounded-lg border border-border bg-surface p-5"
      >
        {hasText ? (
          <QRCode value={text} size={240} level="M" style={{ maxWidth: 240, width: "100%", height: "auto" }} />
        ) : (
          <p className="py-14 text-sm text-muted">{t("emptyMsg")}</p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={downloadPng}
          disabled={!hasText}
          className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("download")}
        </button>
        <button
          type="button"
          onClick={() => copyText(text)}
          disabled={!hasText}
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copyText")}
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}