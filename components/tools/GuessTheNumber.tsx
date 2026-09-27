"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "low" | "high" | "won";

export default function GuessTheNumber() {
  const t = useTranslations("comp.guessTheNumber");
  const [secret, setSecret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [tries, setTries] = useState(0);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Enter") check();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  function check() {
    const value = Number(guess);
    if (guess === "" || Number.isNaN(value) || value < 1 || value > 100) return;
    setTries((prev) => prev + 1);
    if (value === secret) setStatus("won");
    else setStatus(value < secret ? "low" : "high");
  }

  function restart() {
    setSecret(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setStatus("idle");
    setTries(0);
  }

  return (
    <div className="max-w-md">
      <p className="text-sm text-muted">{t("intro")}</p>

      <div className="mt-5 flex gap-3">
        <input
          id="guess-input"
          type="number"
          min={1}
          max={100}
          value={guess}
          onChange={(event) => {
            setGuess(event.target.value);
            if (status !== "idle" && status !== "won") setStatus("idle");
          }}
          placeholder="1–100"
          className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={check}
          disabled={status === "won"}
          className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("guess")}
        </button>
      </div>

      {status === "won" ? (
        <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-5">
          <p className="text-lg font-semibold text-accent">{t("won")}</p>
          <p className="mt-1 text-sm text-muted">{t("tries", { count: tries })}</p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {t("again")}
          </button>
        </div>
      ) : status === "low" ? (
        <p className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-text">
          {t("low")}
        </p>
      ) : status === "high" ? (
        <p className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-text">
          {t("high")}
        </p>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}