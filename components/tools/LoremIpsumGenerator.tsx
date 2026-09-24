"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
];

function parseNumber(value: string): number {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return NaN;
  return Number(normalized);
}

function clampCount(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateLorem(paragraphs: number, sentences: number): string {
  const rand = mulberry32(Math.floor(Math.random() * 0xffffffff));
  const output: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const lines: string[] = [];
    for (let s = 0; s < sentences; s++) {
      const count = 7 + Math.floor(rand() * 6);
      const words: string[] = [];
      for (let w = 0; w < count; w++) {
        words.push(WORDS[Math.floor(rand() * WORDS.length)]);
      }
      const raw = words.join(" ");
      lines.push(raw.charAt(0).toUpperCase() + raw.slice(1) + ".");
    }
    output.push(lines.join(" "));
  }
  return output.join("\n\n");
}

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState("3");
  const [sentences, setSentences] = useState("4");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.loremIpsumGenerator");

  const paragraphCount = useMemo(
    () => clampCount(parseNumber(paragraphs), 3),
    [paragraphs]
  );
  const sentenceCount = useMemo(
    () => clampCount(parseNumber(sentences), 4),
    [sentences]
  );

  function generate() {
    setOutput(generateLorem(paragraphCount, sentenceCount));
    setCopied(false);
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lorem-paragraf" className="block text-sm font-medium text-text">
            {t("parasLabel")}
          </label>
          <input
            id="lorem-paragraf"
            type="text"
            inputMode="numeric"
            value={paragraphs}
            onChange={(event) => setParagraphs(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="lorem-cumle" className="block text-sm font-medium text-text">
            {t("sentencesLabel")}
          </label>
          <input
            id="lorem-cumle"
            type="text"
            inputMode="numeric"
            value={sentences}
            onChange={(event) => setSentences(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("generate")}
      </button>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="lorem-cikti" className="text-sm font-medium text-text">
            {t("outputLabel")}
          </label>
          <button
            type="button"
            onClick={copy}
            disabled={!output}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
        <textarea
          id="lorem-cikti"
          readOnly
          value={output}
          rows={10}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
    </div>
  );
}