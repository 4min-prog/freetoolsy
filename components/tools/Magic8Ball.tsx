"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

export default function Magic8Ball() {
  const [answer, setAnswer] = useState("");
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.magic8Ball");

  async function copyAnswer() {
    if (!answer) return;
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function clearAll() {
    setAnswer("");
    setCount(0);
    setCopied(false);
  }

  const answers = (t.raw("answers") as unknown as string[]) ?? [];

  function shake() {
    if (answers.length === 0) return;
    const index = Math.floor(Math.random() * answers.length);
    setAnswer(answers[index]);
    setCount((current) => current + 1);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-56 w-56 items-center justify-center rounded-full bg-accent/15 ring-1 ring-accent/40">
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-accent p-3 text-center shadow-card">
          <p className="text-sm font-medium leading-snug text-on-accent">
            {answer || <span className="opacity-60">{t("hint")}</span>}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={shake}
        className="mt-6 rounded-lg bg-accent px-8 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
      >
        {t("shake")}
      </button>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={copyAnswer}
          disabled={!answer}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={count === 0}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      {count > 0 ? (
        <p className="mt-3 text-sm text-muted">{t("asked", { count })}</p>
      ) : null}

      <p className="mt-4 max-w-md text-center text-xs leading-relaxed text-muted">
        {t("tip")}
      </p>
    </div>
  );
}