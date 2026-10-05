"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";
import { showToast } from "@/lib/toast";

const WORDS_PER_MINUTE = 200;

const PLATFORM_LIMITS = [
  { key: "twitter", limit: 280 },
  { key: "instagramBio", limit: 150 },
  { key: "instagramCaption", limit: 2200 },
  { key: "metaDescription", limit: 160 },
  { key: "sms", limit: 160 },
  { key: "youtubeTitle", limit: 100 },
] as const;

type PlatformKey = (typeof PLATFORM_LIMITS)[number]["key"];

type Status = "ok" | "warn" | "over";

const STATUS_LABEL: Record<Status, string> = {
  ok: "text-success",
  warn: "text-warning",
  over: "text-danger",
};

const STATUS_BAR: Record<Status, string> = {
  ok: "bg-success",
  warn: "bg-warning",
  over: "bg-danger",
};

const STATUS_DOT: Record<Status, string> = {
  ok: "bg-success",
  warn: "bg-warning",
  over: "bg-danger",
};

const WORD_TRIM = /^[^\wçÇğĞıİöÖşŞüÜ]+|[^\wçÇğĞıİöÖşŞüÜ]+$/g;

function statusFor(count: number, limit: number): Status {
  const ratio = count / limit;
  if (ratio > 1) return "over";
  if (ratio >= 0.9) return "warn";
  return "ok";
}

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<PlatformKey | "custom">("twitter");
  const [customLimit, setCustomLimit] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.characterCounter");
  const locale = useLocale();

  const parsedCustom = Number.parseInt(customLimit, 10);
  const customValid = Number.isFinite(parsedCustom) && parsedCustom > 0;
  const activeLimit =
    platform === "custom" ? (customValid ? parsedCustom : 0) : PLATFORM_LIMITS.find((item) => item.key === platform)!.limit;

  const { stats, topWords, chars, wordTotal } = useMemo(() => {
    const trimmed = text.trim();
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const sentences = trimmed
      ? trimmed.split(/[.!?…]+(?:\s|$)/).filter((part) => part.trim()).length
      : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0;
    const readingMinutes = words.length > 0 ? Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE)) : 0;

    const counts = new Map<string, number>();
    for (const raw of words) {
      const word = raw.toLocaleLowerCase(locale).replace(WORD_TRIM, "");
      if (!word) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    const ranked = Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );

    return {
      chars,
      wordTotal: words.length,
      topWords: ranked.slice(0, 5),
      stats: [
        { key: "chars", value: chars },
        { key: "noSpace", value: charsNoSpace },
        { key: "words", value: words.length },
        { key: "lines", value: lines },
        { key: "sentences", value: sentences },
        { key: "paragraphs", value: paragraphs },
        { key: "readingTime", value: readingMinutes },
      ],
    };
  }, [text, locale]);

  const status: Status = activeLimit > 0 ? statusFor(chars, activeLimit) : "ok";
  const remaining = activeLimit > 0 ? activeLimit - chars : 0;
  const percent = activeLimit > 0 ? Math.min(100, (chars / activeLimit) * 100) : 0;
  const isOver = activeLimit > 0 && chars > activeLimit;

  function densityOf(count: number): number {
    return wordTotal > 0 ? Math.round((count / wordTotal) * 1000) / 10 : 0;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="karakter-metin" className="block text-sm font-medium text-text">
          {t("label")}
        </label>
        <button
          type="button"
          onClick={copy}
          disabled={!text}
          className="min-h-10 rounded-lg border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <textarea
        id="karakter-metin"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setText(SAMPLES["character-counter"])} />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-text">{t("limitLabel")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLATFORM_LIMITS.map((item) => {
            const active = platform === item.key;
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={active}
                onClick={() => setPlatform(item.key)}
                className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {t(`platform.${item.key}`)}
                <span className="ml-1.5 tabular-nums opacity-70">{item.limit}</span>
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={platform === "custom"}
            onClick={() => setPlatform("custom")}
            className={`min-h-10 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              platform === "custom"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {t("platform.custom")}
          </button>
        </div>

        {platform === "custom" ? (
          <div className="mt-3">
            <label htmlFor="karakter-limit" className="block text-xs font-medium text-muted">
              {t("customLimitLabel")}
            </label>
            <input
              id="karakter-limit"
              type="number"
              min={1}
              inputMode="numeric"
              value={customLimit}
              onChange={(event) => setCustomLimit(event.target.value)}
              placeholder={t("customLimitPlaceholder")}
              className="mt-1.5 w-40 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        ) : null}

        {activeLimit > 0 ? (
          <div className="mt-4 rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
                <span className="text-sm font-medium text-text">
                  {platform === "custom" ? t("customLimitActive") : t(`platform.${platform}`)}
                </span>
              </div>
              <span className={`text-lg font-semibold tabular-nums tracking-tight ${STATUS_LABEL[status]}`}>
                {chars}/{activeLimit}
              </span>
            </div>

            <div
              role="progressbar"
              aria-label={platform === "custom" ? t("customLimitActive") : t(`platform.${platform}`)}
              aria-valuenow={chars}
              aria-valuemin={0}
              aria-valuemax={activeLimit}
              className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2"
            >
              <div
                className={`h-full rounded-full ${STATUS_BAR[status]}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className={`mt-2 text-xs font-medium ${STATUS_LABEL[status]}`}>
              {isOver
                ? t("overBy", { count: Math.abs(remaining) })
                : t("remaining", { count: remaining })}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted">{t("customLimitEmpty")}</p>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.key} className="bg-surface px-4 py-3">
            <dt className="text-xs text-muted">{t(stat.key)}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-text">
              {stat.key === "readingTime" ? t("readingMinutes", { minutes: stat.value }) : stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {topWords.length > 0 ? (
        <div className="mt-5">
          <p className="text-sm font-medium text-text">{t("topWords")}</p>
          <ol className="mt-2 grid gap-2 sm:grid-cols-2">
            {topWords.map(([word, count], index) => (
              <li
                key={word}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="w-5 shrink-0 text-xs tabular-nums text-faint">{index + 1}.</span>
                  <span className="truncate text-text">{word}</span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted">
                  {count}×
                  <span className="ml-1.5">{t("density", { percent: densityOf(count) })}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}