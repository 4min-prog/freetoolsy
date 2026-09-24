"use client";

import { showToast } from "@/lib/toast";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const MODES = ["trim", "spaces", "empty", "all"] as const;

type ModeId = (typeof MODES)[number];

export default function WhitespaceCleaner() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<ModeId[]>(["trim", "spaces"]);
  const [output, setOutput] = useState("");
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.whitespaceCleaner");

  function toggleMode(mode: ModeId) {
    setSelected((prev) =>
      prev.includes(mode) ? prev.filter((item) => item !== mode) : [...prev, mode]
    );
  }

  function apply() {
    let result = input;
    if (selected.includes("all")) {
      result = result.replace(/\s/g, "");
    } else {
      if (selected.includes("trim")) {
        result = result
          .split("\n")
          .map((line) => line.trim())
          .join("\n");
      }
      if (selected.includes("spaces")) {
        result = result.replace(/[ \t]+/g, " ");
      }
      if (selected.includes("empty")) {
        result = result
          .split("\n")
          .filter((line) => line.length > 0)
          .join("\n");
      }
    }
    setOutput(result);
    setApplied(true);
  }

  function copyResult() {
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true); showToast();
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  }

  return (
    <div>
      <fieldset>
        <legend className="block text-sm font-medium text-text">
          {t("modeLabel")}
        </legend>
        <div className="mt-2 space-y-2">
          {MODES.map((mode) => (
            <label
              key={mode}
              className="flex items-center gap-2.5 text-sm text-muted"
            >
              <input
                type="checkbox"
                checked={selected.includes(mode)}
                onChange={() => toggleMode(mode)}
                className="h-4 w-4 rounded border-border bg-bg accent-accent"
              />
              {t(`mode${mode.charAt(0).toUpperCase()}${mode.slice(1)}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor="bosluk-girdi" className="mt-5 block text-sm font-medium text-text">
        {t("inputLabel")}
      </label>
      <textarea
        id="bosluk-girdi"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={6}
        className="mt-2 w-full resize-y rounded-lg border border-border bg-bg px-3.5 py-3 text-sm leading-relaxed text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setInput(SAMPLES["whitespace-cleaner"])} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={apply}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          {t("apply")}
        </button>
        {applied && (
          <span className="text-sm text-muted">
            {t("characters", { count: output.length })}
          </span>
        )}
      </div>

      {applied && (
        <div className="mt-4 rounded-lg border border-border bg-bg p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 break-words whitespace-pre-wrap text-sm leading-relaxed text-text">
              {output || "…"}
            </p>
            <button
              type="button"
              onClick={copyResult}
              disabled={!output}
              className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}