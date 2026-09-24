"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

type StyleBases = { upper: number; lower: number; digit: number | null };

const STYLES: { key: string; labelKey: string; bases: StyleBases }[] = [
  { key: "bold", labelKey: "styleBold", bases: { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce } },
  { key: "italic", labelKey: "styleItalic", bases: { upper: 0x1d434, lower: 0x1d44e, digit: null } },
  { key: "boldItalic", labelKey: "styleBoldItalic", bases: { upper: 0x1d468, lower: 0x1d482, digit: null } },
  { key: "mono", labelKey: "styleMono", bases: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 } },
];

function styleText(value: string, bases: StyleBases): string {
  let out = "";
  let i = 0;
  while (i < value.length) {
    const code = value.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < value.length) {
      out += value[i] + value[i + 1];
      i += 2;
      continue;
    }
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(bases.upper + code - 65);
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(bases.lower + code - 97);
    } else if (code >= 48 && code <= 57 && bases.digit !== null) {
      out += String.fromCodePoint(bases.digit + code - 48);
    } else {
      out += value[i];
    }
    i += 1;
  }
  return out;
}

export default function FancyTextGenerator() {
  const [text, setText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const t = useTranslations("comp.fancyTextGenerator");

  const outputs = useMemo(() => {
    const result: Record<string, string> = {};
    for (let i = 0; i < STYLES.length; i++) {
      result[STYLES[i].key] = styleText(text, STYLES[i].bases);
    }
    return result;
  }, [text]);

  async function copyValue(value: string, index: number) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index); showToast();
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      setCopiedIndex(null);
    }
  }

  return (
    <div>
      <label
        htmlFor="kalin-metin"
        className="block text-sm font-medium text-text"
      >
        {t("label")}
      </label>
      <textarea
        id="kalin-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["fancy-text-generator"])} />
      </div>

      <div className="mt-5 space-y-3">
        {STYLES.map((style, index) => {
          const output = outputs[style.key];
          return (
            <div
              key={style.key}
              className="flex items-start justify-between gap-3 rounded-lg border border-border bg-bg px-3.5 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">{t(style.labelKey)}</p>
                <p
                  className={`mt-1 break-all text-xl leading-relaxed ${
                    output ? "text-text" : "text-faint"
                  }`}
                >
                  {output || "…"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyValue(output, index)}
                disabled={!output}
                className="shrink-0 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
              >
                {copiedIndex === index ? t("copied") : t("copy")}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}