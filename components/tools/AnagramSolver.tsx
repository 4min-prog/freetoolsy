"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

const MAX_LENGTH = 9;
const MAX_RESULTS = 2000;

export default function AnagramSolver() {
  const [letters, setLetters] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.anagramSolver");

  const result = useMemo(() => {
    const cleaned = letters
      .toLowerCase()
      .replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ0-9]/g, "")
      .slice(0, MAX_LENGTH);
    if (!cleaned) return { words: [] as string[], total: 0 };
    const unique = new Set<string>();
    const chars = cleaned.split("");
    function backtrack(path: string[], used: boolean[]) {
      if (path.length === chars.length) {
        unique.add(path.join(""));
        return;
      }
      for (let i = 0; i < chars.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.push(chars[i]);
        backtrack(path, used);
        path.pop();
        used[i] = false;
      }
    }
    backtrack([], Array(chars.length).fill(false));
    const words = Array.from(unique).sort();
    return { words: words.slice(0, MAX_RESULTS), total: words.length };
  }, [letters]);

  async function copy() {
    const value = result.words.join("\n");
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function clear() {
    setLetters("");
    setCopied(false);
  }

  return (
    <div>
      <label htmlFor="as-letters" className="block text-xs font-medium text-muted">
        {t("lettersLabel")}
      </label>
      <input
        id="as-letters"
        type="text"
        value={letters}
        onChange={(event) => setLetters(event.target.value)}
        placeholder={t("lettersPlaceholder")}
        className="mt-1 w-full max-w-md rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {letters ? (
        <p className="mt-3 text-sm text-muted">
          {result.total > MAX_RESULTS ? t("partial", { shown: result.words.length, total: result.total }) : t("totalCount", { count: result.total })}
        </p>
      ) : null}

      {result.words.length > 0 ? (
        <div className="mt-4 rounded-lg border border-border bg-surface">
          <div className="grid max-h-96 grid-cols-3 gap-px overflow-auto bg-border sm:grid-cols-4">
            {result.words.map((word) => (
              <div key={word} className="bg-surface px-3 py-2 text-sm text-text">
                {word}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={copy}
          disabled={result.words.length === 0}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={!letters}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}