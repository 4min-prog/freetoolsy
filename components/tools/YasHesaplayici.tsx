"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

function parseBirthDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function diffComponents(birth: Date, now: Date) {
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  let hours = now.getHours() - birth.getHours();
  let minutes = now.getMinutes() - birth.getMinutes();
  let seconds = now.getSeconds() - birth.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days, hours, minutes, seconds };
}

function nextBirthday(birth: Date, now: Date): Date {
  let next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  next.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (next.getTime() <= today) {
    next = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  next.setHours(0, 0, 0, 0);
  return next;
}

const DAY_MS = 1000 * 60 * 60 * 24;

function Stat(props: { label: string; value: string | number; pulse?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-bg px-3 py-3 text-center">
      <div
        className={`text-2xl font-semibold tabular-nums tracking-tight text-text ${
          props.pulse ? "animate-pulse" : ""
        }`}
      >
        {props.value}
      </div>
      <div className="mt-1 text-xs text-muted">{props.label}</div>
    </div>
  );
}

export default function YasHesaplayici() {
  const [birthValue, setBirthValue] = useState("");
  const [now, setNow] = useState(() => new Date());
  const t = useTranslations("comp.yas");

  const birth = useMemo(() => parseBirthDate(birthValue), [birthValue]);

  useEffect(() => {
    if (!birth) return;
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, [birth]);

  const components = useMemo(
    () => (birth && birth.getTime() < now.getTime() ? diffComponents(birth, now) : null),
    [birth, now]
  );

  const birthdayInfo = useMemo(() => {
    if (!birth) return null;
    if (birth.getTime() > now.getTime()) {
      return { days: null, future: true };
    }
    const next = nextBirthday(birth, now);
    const days = Math.ceil((next.getTime() - now.getTime()) / DAY_MS);
    return { days, future: false };
  }, [birth, now]);

  const output: ReactNode[] = [];

  if (components && birthdayInfo && birth) {
    output.push(
      <div key="stats" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Stat label={t("year")} value={components.years} />
        <Stat label={t("month")} value={components.months} />
        <Stat label={t("day")} value={components.days} />
        <Stat label={t("hour")} value={components.hours} />
        <Stat label={t("minute")} value={components.minutes} />
        <Stat label={t("second")} value={components.seconds} pulse />
      </div>
    );

    if (birthdayInfo.days !== null) {
      output.push(
        <p key="birthday" className="mt-5 text-sm leading-relaxed text-muted">
          {t("daysLeft", { days: birthdayInfo.days })}
        </p>
      );
    }
  }

  return (
    <div>
      <label htmlFor="yas-dogum" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <input
        id="yas-dogum"
        type="date"
        max={new Date().toISOString().slice(0, 10)}
        value={birthValue}
        onChange={(event) => setBirthValue(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <p className="mt-3 text-xs leading-relaxed text-muted">{t("note")}</p>

      {birthdayInfo && birthdayInfo.future ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {t("futureError")}
        </p>
      ) : null}

      {output.length > 0 ? (
        <div className="mt-5">{output}</div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-bg px-5 py-6 text-center">
          <p className="text-sm text-muted">{t("emptyState")}</p>
        </div>
      )}
    </div>
  );
}