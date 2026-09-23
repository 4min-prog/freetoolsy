"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const FLAGS = [
  { id: "g", labelKey: "flagG" },
  { id: "i", labelKey: "flagI" },
  { id: "m", labelKey: "flagM" },
  { id: "s", labelKey: "flagS" },
  { id: "u", labelKey: "flagU" },
] as const;

type FlagId = (typeof FLAGS)[number]["id"];

type Result =
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ok"; ranges: { start: number; end: number }[] };

export default function RegexTesti() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<FlagId[]>(["g", "i"]);
  const [text, setText] = useState("");
  const t = useTranslations("comp.regex");

  const flagsString = flags.join("");

  function toggleFlag(flag: FlagId) {
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((item) => item !== flag) : [...prev, flag]
    );
  }

  const result = useMemo<Result>(() => {
    if (!pattern) return { status: "empty" };
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flagsString);
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      };
    }
    const ranges: { start: number; end: number }[] = [];
    if (flagsString.includes("g")) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        ranges.push({ start: match.index, end: match.index + match[0].length });
        if (match[0].length === 0) regex.lastIndex += 1;
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        ranges.push({ start: match.index, end: match.index + match[0].length });
      }
    }
    return { status: "ok", ranges };
  }, [pattern, flagsString, text]);

  const highlighted = useMemo<ReactNode>(() => {
    if (result.status !== "ok") return text;
    const nodes: ReactNode[] = [];
    let cursor = 0;
    result.ranges.forEach((range, index) => {
      if (range.start > cursor) {
        nodes.push(text.slice(cursor, range.start));
      }
      nodes.push(
        <mark
          key={index}
          className="rounded-sm bg-accent/30 px-0.5 text-text"
        >
          {text.slice(range.start, range.end)}
        </mark>
      );
      cursor = Math.max(cursor, range.end);
    });
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
  }, [result, text]);

  return (
    <div>
      <div>
        <label htmlFor="regex-desen" className="block text-sm font-medium text-text">
          {t("patternLabel")}
        </label>
        <input
          id="regex-desen"
          type="text"
          value={pattern}
          onChange={(event) => setPattern(event.target.value)}
          placeholder={t("patternPlaceholder")}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <fieldset className="mt-5">
        <legend className="block text-sm font-medium text-text">{t("flagsLabel")}</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {FLAGS.map((flag) => {
            const active = flags.includes(flag.id);
            return (
              <button
                key={flag.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleFlag(flag.id)}
                className={`rounded-md border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent/10 text-text"
                    : "border-border bg-surface text-muted hover:text-text"
                }`}
              >
                {flag.id}
                <span className="ml-1 font-sans font-normal text-faint">
                  — {t(flag.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="regex-metin" className="block text-sm font-medium text-text">
          {t("textLabel")}
        </label>
        <textarea
          id="regex-metin"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={6}
          placeholder={t("textPlaceholder")}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <SampleButton onApply={() => setText(SAMPLES["regex-testi"])} />
        </div>
      </div>

      {result.status === "error" ? (
        <div className="mt-5 rounded-lg border border-danger/30 bg-danger/5 px-5 py-4">
          <p className="text-sm text-danger">
            {t("error", { message: result.message })}
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-border bg-bg p-4">
          {result.status === "ok" && (
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              {result.ranges.length === 0
                ? t("noMatches")
                : result.ranges.length === 1
                  ? t("matchCountOne", { count: 1 })
                  : t("matchCountMany", { count: result.ranges.length })}
            </p>
          )}
          <div className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-muted">
            {hasHighlight(result) ? highlighted : text || "…"}
          </div>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}

function hasHighlight(result: Result): boolean {
  return result.status === "ok" && result.ranges.length > 0;
}