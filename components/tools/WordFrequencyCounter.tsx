"use client";

import { showToast } from "@/lib/toast";

import { useState } from "react";
import { useTranslations } from "next-intl";

const STOP_WORDS = new Set([
  "the", "a", "an", "of", "to", "and", "is", "in", "for", "on", "with", "at", "by",
  "or", "it", "this", "that", "you", "be", "as", "from", "have", "has", "are", "was",
  "were", "but", "not", "i", "he", "she", "they", "we",
]);

type Entry = { word: string; count: number };

export default function WordFrequencyCounter() {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [excludeStopwords, setExcludeStopwords] = useState(true);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.wordFrequencyCounter");

  function analyze() {
    const words = input
      .toLowerCase()
      .split(/[^a-z0-9çğıöşüâîû']+/)
      .filter(Boolean);
    const counts = new Map<string, number>();
    for (const word of words) {
      if (excludeStopwords && STOP_WORDS.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    const result = Array.from(counts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
      .slice(0, 40);
    setEntries(result);
  }

  const totalWords = Array.from(entries).reduce((sum, entry) => sum + entry.count, 0);

  async function copyResults() {
    if (!entries.length) return;
    try {
      await navigator.clipboard.writeText(
        entries.map((entry) => `${entry.word}: ${entry.count}`).join("\n")
      );
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="wfc-input" className="block text-sm font-medium text-text">
          {t("inputLabel")}
        </label>
        <textarea
          id="wfc-input"
          rows={7}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t("inputPlaceholder")}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={excludeStopwords}
          onChange={(event) => setExcludeStopwords(event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        {t("excludeStopwords")}
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={analyze}
          disabled={!input.trim()}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("analyze")}
        </button>
        <button
          type="button"
          onClick={() => {
            setInput("");
            setEntries([]);
            setCopied(false);
          }}
          disabled={!input && !entries.length}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <div className="flex items-center justify-between gap-2 bg-surface-2 px-3 py-2 text-sm text-muted">
            <span>{t("results", { count: entries.length, total: totalWords })}</span>
            <button
              type="button"
              onClick={copyResults}
              className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-bg text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">{t("wordCol")}</th>
                <th className="px-3 py-2 text-right font-medium">{t("countCol")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.word} className="border-t border-border bg-surface">
                  <td className="px-3 py-1.5 text-text">{entry.word}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted">{entry.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}