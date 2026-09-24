"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

type SortMode = "sortAz" | "sortZa" | "byLength" | "numeric" | "shuffle";

function numericValue(line: string): number {
  const parsed = Number(line.trim().replace(",", "."));
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

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

export default function TextSorter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.textSorter");

  const lines = useMemo(
    () => input.split("\n").filter((line) => line.trim() !== ""),
    [input]
  );

  const hasOutput = useMemo(() => output.length > 0, [output]);

  function apply(mode: SortMode) {
    const items = [...lines];
    if (mode === "sortAz") {
      items.sort((a, b) => a.localeCompare(b, "tr"));
    } else if (mode === "sortZa") {
      items.sort((a, b) => b.localeCompare(a, "tr"));
    } else if (mode === "byLength") {
      items.sort(
        (a, b) => a.length - b.length || a.localeCompare(b, "tr")
      );
    } else if (mode === "numeric") {
      items.sort((a, b) => numericValue(a) - numericValue(b));
    } else {
      setOutput(shuffle(items).join("\n"));
      return;
    }
    setOutput(items.join("\n"));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const buttons: { mode: SortMode; label: string }[] = [
    { mode: "sortAz", label: t("sortAz") },
    { mode: "sortZa", label: t("sortZa") },
    { mode: "byLength", label: t("byLength") },
    { mode: "numeric", label: t("numeric") },
    { mode: "shuffle", label: t("shuffle") },
  ];

  return (
    <div>
      <label htmlFor="siralayici-girdi" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <textarea
        id="siralayici-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={t("placeholder")}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["text-sorter"])} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {buttons.map((button) => (
          <button
            key={button.mode}
            type="button"
            onClick={() => apply(button.mode)}
            disabled={lines.length === 0}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              button.mode === "sortAz"
                ? "bg-accent text-on-accent hover:opacity-90"
                : "border border-border bg-surface text-muted hover:border-strong hover:text-text"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {button.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text">{t("outputLabel")}</p>
        <button
          type="button"
          onClick={copy}
          disabled={!hasOutput}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <textarea
        value={output}
        readOnly
        rows={10}
        spellCheck={false}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}