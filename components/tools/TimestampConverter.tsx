"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function TimestampConverter() {
  const [secondsInput, setSecondsInput] = useState("");
  const [dateResult, setDateResult] = useState("");
  const [dateError, setDateError] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [tsResult, setTsResult] = useState("");
  const [tsError, setTsError] = useState(false);
  const t = useTranslations("comp.timestamp");

  function toDate() {
    const raw = secondsInput.trim().replace(",", ".");
    const seconds = Number(raw);
    if (!raw || !Number.isFinite(seconds)) {
      setDateError(true);
      setDateResult("");
      return;
    }
    setDateError(false);
    setDateResult(new Date(seconds * 1000).toLocaleString());
  }

  function toTimestamp() {
    if (!dateInput) {
      setTsError(true);
      setTsResult("");
      return;
    }
    const timestamp = Math.floor(new Date(dateInput).getTime() / 1000);
    if (!Number.isFinite(timestamp)) {
      setTsError(true);
      setTsResult("");
      return;
    }
    setTsError(false);
    setTsResult(String(timestamp));
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <p className="text-sm font-medium text-text">{t("tsToDateLabel")}</p>
        <input
          type="text"
          inputMode="decimal"
          value={secondsInput}
          onChange={(event) => {
            setSecondsInput(event.target.value);
            setDateError(false);
            setDateResult("");
          }}
          placeholder={t("tsToDatePlaceholder")}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={toDate}
          className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("convertToDate")}
        </button>
        {dateError ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
          >
            {t("invalidTs")}
          </p>
        ) : (
          dateResult && (
            <p className="mt-4 break-all rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text">
              {dateResult}
            </p>
          )
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <p className="text-sm font-medium text-text">{t("dateToTsLabel")}</p>
        <input
          type="datetime-local"
          value={dateInput}
          onChange={(event) => {
            setDateInput(event.target.value);
            setTsError(false);
            setTsResult("");
          }}
          placeholder={t("dateToTsPlaceholder")}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={toTimestamp}
          className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          {t("convertToTs")}
        </button>
        {tsError ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
          >
            {t("invalidTs")}
          </p>
        ) : (
          tsResult && (
            <p className="mt-4 break-all rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm tabular-nums text-text">
              {tsResult}
            </p>
          )
        )}
      </div>
    </div>
  );
}