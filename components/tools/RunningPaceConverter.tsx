"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

const DISTANCES_KM = [
  { key: "d5k", value: 5 },
  { key: "d10k", value: 10 },
  { key: "half", value: 21.0975 },
  { key: "marathon", value: 42.195 },
] as const;

export default function RunningPaceConverter() {
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("30");
  const t = useTranslations("comp.runningPaceConverter");

  const paceSeconds = useMemo(() => {
    const min = Number(minutes) || 0;
    const sec = Number(seconds) || 0;
    if (min === 0 && sec === 0) return null;
    return min * 60 + sec;
  }, [minutes, seconds]);

  const speed = paceSeconds === null ? null : 3600 / paceSeconds;

  return (
    <div>
      <p className="text-sm font-medium text-text">{t("paceLabel")}</p>
      <div className="mt-2 flex max-w-lg items-center gap-3">
        <div className="flex-1">
          <label
            htmlFor="pace-min"
            className="block text-xs text-muted"
          >
            {t("minutes")}
          </label>
          <input
            id="pace-min"
            type="number"
            min={0}
            max={180}
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <span className="font-mono text-lg text-muted">:</span>
        <div className="flex-1">
          <label htmlFor="pace-sec" className="block text-xs text-muted">
            {t("seconds")}
          </label>
          <input
            id="pace-sec"
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(event) => setSeconds(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <span className="text-sm text-muted">{t("perKm")}</span>
      </div>

      {paceSeconds !== null && speed !== null ? (
        <div className="mt-6">
          <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
            <p className="text-xs text-muted">{t("speed")}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-text">
              {speed.toFixed(1)} <span className="text-sm font-normal">{t("kmh")}</span>
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DISTANCES_KM.map((distance) => (
              <div
                key={distance.key}
                className="rounded-lg border border-border bg-surface px-3 py-3"
              >
                <p className="text-xs text-muted">{t(distance.key)}</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-text">
                  {formatTime(paceSeconds * distance.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}