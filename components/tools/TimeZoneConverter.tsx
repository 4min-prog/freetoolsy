"use client";

import { showToast } from "@/lib/toast";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

/** IANA dilinde saat dilimi tanimini sunucudan degil, tarayicinin Intl verisinden aliyoruz. */
function zoneOptions() {
  const supported = Intl.supportedValuesOf("timeZone");
  return supported.length > 0 ? supported : ["UTC"];
}

function offsetLabel(zone: string, at: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "shortOffset",
  });
  const part = formatter.formatToParts(at).find((item) => item.type === "timeZoneName");
  return part?.value ?? "";
}

function formatIn(zone: string, at: Date, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: zone,
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(at);
  } catch {
    return "—";
  }
}

function localInputValue(at: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}T${pad(at.getHours())}:${pad(at.getMinutes())}`;
}

export default function TimeZoneConverter() {
  const t = useTranslations("comp.timeZoneConverter");
  const [zones, setZones] = useState<string[]>([]);
  const [source, setSource] = useState("Europe/Istanbul");
  const [target, setTarget] = useState("UTC");
  const [when, setWhen] = useState(() => localInputValue(new Date()));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setZones(zoneOptions());
  }, []);

  const instant = useMemo(() => {
    // input type=datetime-local degeri tarayici yerel saatinde; bunu
    // referans alip secili zaman dilimine ceviriyoruz.
    if (!when) return null;
    const parsed = new Date(when);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [when]);

  const now = useMemo(() => new Date(), []);

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

  return (
    <div>
      <div className="grid gap-4">
        <div>
          <label htmlFor="tz-zaman" className="block text-sm font-medium text-text">
            {t("field.when")}
          </label>
          <input
            id="tz-zaman"
            type="datetime-local"
            value={when}
            onChange={(event) => setWhen(event.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tz-source" className="block text-sm font-medium text-text">
              {t("field.from")}
            </label>
            <select
              id="tz-source"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className={`${inputClass} mt-1.5`}
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tz-target" className="block text-sm font-medium text-text">
              {t("field.to")}
            </label>
            <select
              id="tz-target"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className={`${inputClass} mt-1.5`}
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton
          onApply={() => {
            setSource("Europe/Istanbul");
            setTarget("America/New_York");
            setWhen(localInputValue(new Date()));
          }}
        />
        <button
          type="button"
          onClick={() => setWhen(localInputValue(new Date()))}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
        >
          {t("useNow")}
        </button>
      </div>

      {instant && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { zone: source, label: t("field.from") },
            { zone: target, label: t("field.to") },
          ].map((row) => (
            <div
              key={row.zone}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-faint">
                {row.label}
              </p>
              <p className="mt-1 font-mono text-xs text-muted">{row.zone.replace(/_/g, " ")}</p>
              <p className="mt-2 text-sm text-text">{formatIn(row.zone, instant, "en-US")}</p>
              <p className="mt-0.5 text-xs text-faint">{offsetLabel(row.zone, instant)}</p>
            </div>
          ))}
        </div>
      )}

      {instant && (
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-xs tabular-nums text-faint">
            {t("diff", {
              source: offsetLabel(source, instant) || "—",
              target: offsetLabel(target, instant) || "—",
            })}
          </p>
          <button
            type="button"
            onClick={() => copy(formatIn(target, instant, "en-US"))}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text"
          >
            {copied ? t("copied") : t("copyResult")}
          </button>
        </div>
      )}

      <div className="mt-5">
        <p className="text-sm font-medium text-text">{t("commonTitle")}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {zones.slice(0, 24).map((zone) => (
            <div
              key={zone}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2"
            >
              <span className="truncate text-xs text-muted">{zone.replace(/_/g, " ")}</span>
              <span className="shrink-0 text-xs tabular-nums text-faint">
                {formatIn(zone, instant ?? now, "en-US")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}
