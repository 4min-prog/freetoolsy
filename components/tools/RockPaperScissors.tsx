"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand, faHandFist, faScissors } from "@fortawesome/free-solid-svg-icons";

type Choice = "rock" | "paper" | "scissors";

const BEATS: Record<Choice, Choice> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

const ICONS: Record<Choice, typeof faHand> = {
  rock: faHandFist,
  paper: faHand,
  scissors: faScissors,
};

export default function RockPaperScissors() {
  const [wins, setWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [losses, setLosses] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const t = useTranslations("comp.rockPaperScissors");

  function play(choice: Choice) {
    const options: Choice[] = ["rock", "paper", "scissors"];
    const ai = options[Math.floor(Math.random() * options.length)];
    if (choice === ai) {
      setTies((value) => value + 1);
      setLast(t("resultTie"));
    } else if (BEATS[choice] === ai) {
      setWins((value) => value + 1);
      setLast(t("resultWin"));
    } else {
      setLosses((value) => value + 1);
      setLast(t("resultLose"));
    }
  }

  function reset() {
    setWins(0);
    setTies(0);
    setLosses(0);
    setLast(null);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {(["rock", "paper", "scissors"] as Choice[]).map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => play(choice)}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-surface text-accent transition-colors hover:border-accent hover:bg-accent/10"
          >
            <FontAwesomeIcon icon={ICONS[choice]} className="h-7 w-7" />
            <span className="text-xs font-medium">{t(choice)}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 h-6 text-base font-semibold text-accent">
        {last ?? ""}
      </div>

      <div className="mt-2 grid w-full max-w-sm grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-border bg-surface px-3 py-2">
          <p className="text-xs text-muted">{t("you")}</p>
          <p className="text-lg font-semibold tabular-nums text-text">{wins}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface px-3 py-2">
          <p className="text-xs text-muted">{t("ties")}</p>
          <p className="text-lg font-semibold tabular-nums text-text">{ties}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface px-3 py-2">
          <p className="text-xs text-muted">{t("ai")}</p>
          <p className="text-lg font-semibold tabular-nums text-text">{losses}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
      >
        {t("reset")}
      </button>

      <p className="mt-5 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}