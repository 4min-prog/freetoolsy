"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

function shuffle(items: string[]): string[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export default function ListeKaristirici() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.listeKaristirici");

  const items = useMemo(
    () =>
      input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== ""),
    [input]
  );

  const valid = useMemo(() => items.length >= 2, [items]);

  function run(mode: "shuffle" | "draw") {
    if (!valid) {
      setResult("");
      setError(t("invalid"));
      return;
    }
    setError(null);
    if (mode === "draw") {
      setResult(items[Math.floor(Math.random() * items.length)]);
    } else {
      setResult(shuffle(items).join("\n"));
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <label htmlFor="liste-girdi" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="liste-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["liste-karistirici"])} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run("shuffle")}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("shuffle")}
        </button>
        <button
          type="button"
          onClick={() => run("draw")}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {t("draw")}
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text">{t("resultLabel")}</p>
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <textarea
        value={result}
        readOnly
        rows={5}
        spellCheck={false}
        placeholder=""
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}