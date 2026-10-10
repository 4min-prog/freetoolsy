"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

const ACTIVITIES: { id: string; met: number }[] = [
  { id: "sedentary", met: 1.3 },
  { id: "walking", met: 3.5 },
  { id: "brisk", met: 4.3 },
  { id: "running", met: 9.8 },
  { id: "cycling", met: 7.5 },
  { id: "swimming", met: 8.0 },
  { id: "yoga", met: 2.5 },
  { id: "gym", met: 6.0 },
  { id: "basketball", met: 6.5 },
  { id: "football", met: 7.0 },
  { id: "dancing", met: 5.0 },
  { id: "jumpingRope", met: 11.0 },
];

export default function CaloriesBurnedCalculator() {
  const [weight, setWeight] = useState("");
  const [minutes, setMinutes] = useState("");
  const [activity, setActivity] = useState("walking");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.caloriesBurnedCalculator");

  async function copy(value: string) {
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
    setWeight("");
    setMinutes("");
    setActivity("walking");
    setCopied(false);
  }

  const w = Number(weight);
  const m = Number(minutes);
  const met = ACTIVITIES.find((a) => a.id === activity)?.met ?? 0;
  const valid = weight !== "" && minutes !== "" && !Number.isNaN(w) && !Number.isNaN(m) && w > 0;

  const kCal = valid ? (met * 3.5 * w) / 200 * m : 0;

  return (
    <div>
      <label htmlFor="cal-weight" className="block text-sm font-medium text-text">
        {t("weightLabel")}
      </label>
      <input
        id="cal-weight"
        type="number"
        min="0"
        step="any"
        value={weight}
        onChange={(event) => setWeight(event.target.value)}
        placeholder="70"
        className="mt-2 w-full max-w-sm rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label htmlFor="cal-minutes" className="mt-4 block text-sm font-medium text-text">
        {t("minutesLabel")}
      </label>
      <input
        id="cal-minutes"
        type="number"
        min="0"
        step="any"
        value={minutes}
        onChange={(event) => setMinutes(event.target.value)}
        placeholder="30"
        className="mt-2 w-full max-w-sm rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm tabular-nums text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <label htmlFor="cal-activity" className="mt-4 block text-sm font-medium text-text">
        {t("activityLabel")}
      </label>
      <select
        id="cal-activity"
        value={activity}
        onChange={(event) => setActivity(event.target.value)}
        className="mt-2 w-full max-w-sm rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {ACTIVITIES.map((a) => (
          <option key={a.id} value={a.id}>
            {t(`activity.${a.id}`)} · MET {a.met}
          </option>
        ))}
      </select>

      {valid ? (
        <div className="mt-6 max-w-sm rounded-lg border border-border bg-surface p-5">
          <p className="text-xs text-muted">{t("resultLabel")}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-text">
            {kCal.toFixed(0)}
            <span className="ml-1 text-lg font-medium text-muted">kcal</span>
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
          {t("empty")}
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => copy(valid ? `${kCal.toFixed(0)} kcal` : "")}
          disabled={!valid}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={!weight && !minutes && activity === "walking"}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}