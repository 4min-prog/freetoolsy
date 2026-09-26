"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Magic8Ball() {
  const [answer, setAnswer] = useState("");
  const [count, setCount] = useState(0);
  const t = useTranslations("comp.magic8Ball");

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

      {count > 0 ? (
        <p className="mt-3 text-sm text-muted">{t("asked", { count })}</p>
      ) : null}

      <p className="mt-4 max-w-md text-center text-xs leading-relaxed text-muted">
        {t("tip")}
      </p>
    </div>
  );
}