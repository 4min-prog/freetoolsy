"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SampleButton from "@/components/SampleButton";
import { SAMPLES } from "@/data/samples";

const SHORT_PASSWORDS = new Set([
  "123456",
  "password",
  "123456789",
  "12345678",
  "12345",
  "qwerty",
  "1234567",
  "111111",
  "123123",
  "abc123",
  "1234567890",
  "letmein",
  "qwerty123",
  "dragon",
  "11111111",
  "baseball",
  "iloveyou",
]);

type StrengthLevel = 0 | 1 | 2 | 3 | 4 | 5;

function classSize(value: string): number {
  const sizes: string[] = [];
  if (/[a-z]/.test(value)) sizes.push("lower");
  if (/[A-Z]/.test(value)) sizes.push("upper");
  if (/\d/.test(value)) sizes.push("digit");
  if (/[^a-zA-Z0-9]/.test(value)) sizes.push("symbol");
  let size = 0;
  sizes.forEach((item) => {
    if (item === "lower" || item === "upper") size += 26;
    else if (item === "digit") size += 10;
    else size += 33;
  });
  return size;
}

function entropy(value: string): number {
  const size = classSize(value);
  if (size === 0) return 0;
  const pool = Math.log(size) / Math.log(2);
  return Math.floor(pool * value.length);
}

function strengthLabel(level: StrengthLevel, t: ReturnType<typeof useTranslations>): string {
  if (level === 0) return t("empty");
  if (level === 1) return t("veryWeak");
  if (level === 2) return t("weak");
  if (level === 3) return t("medium");
  if (level === 4) return t("strong");
  return t("veryStrong");
}

function levelColor(level: StrengthLevel): string {
  if (level === 1) return "bg-danger";
  if (level === 2) return "bg-[#F59E0B]";
  if (level === 3) return "bg-[#F59E0B]";
  if (level === 4) return "bg-success";
  if (level === 5) return "bg-success";
  return "bg-border";
}

export default function ParolaGucTesti() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const t = useTranslations("comp.passwordStrength");

  const analysis = useMemo(() => {
    if (!password) return { level: 0 as StrengthLevel, bits: 0, common: false };
    const bits = entropy(password);
    const length = password.length;
    let level: StrengthLevel;

    if (length < 8) level = 2;
    else if (length < 12) level = 3;
    else {
      const sizes =
        (/[a-z]/.test(password) ? 1 : 0) +
        (/[A-Z]/.test(password) ? 1 : 0) +
        (/\d/.test(password) ? 1 : 0) +
        (/[^a-zA-Z0-9]/.test(password) ? 1 : 0);
      level = sizes >= 3 ? 4 : 3;
    }
    if (bits < 28) level = 1;
    if (!password) level = 0;

    const common = SHORT_PASSWORDS.has(password.toLowerCase());

    if (common) level = 1;

    return { level, bits, common };
  }, [password]);

  const checks = [
    { id: "checkLength", ok: password.length >= 8 },
    { id: "checkLower", ok: /[a-z]/.test(password) },
    { id: "checkUpper", ok: /[A-Z]/.test(password) },
    { id: "checkDigit", ok: /\d/.test(password) },
    { id: "checkSymbol", ok: /[^a-zA-Z0-9]/.test(password) },
  ];

  const percent = password ? Math.min(100, Math.max(6, analysis.level * 20)) : 0;

  return (
    <div>
      <label htmlFor="pgp-sifre" className="block text-sm font-medium text-text">
        {t("label")}
      </label>
      <div className="relative mt-2">
        <input
          id="pgp-sifre"
          type={visible ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t("placeholder")}
          className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 pr-20 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          disabled={!password}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-40"
        >
          {visible ? t("hide") : t("show")}
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <SampleButton onApply={() => setPassword(SAMPLES["parola-guc-testi"])} />
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("strength", { label: "" })} 
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${levelColor(analysis.level)}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-text">
          {t("strength", { label: strengthLabel(analysis.level, t) })}
        </p>
        {password ? (
          <p className="text-xs tabular-nums text-muted">{t("bits", { bits: analysis.bits })}</p>
        ) : null}
      </div>

      {analysis.common ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger"
        >
          {t("commonWarning")}
        </p>
      ) : null}

      {password ? (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {checks.map((check) => (
            <li
              key={check.id}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                check.ok
                  ? "border-success-border bg-success-bg text-success"
                  : "border-border bg-bg text-muted"
              }`}
            >
              <span aria-hidden="true" className={check.ok ? "text-success" : "text-faint"}>
                {check.ok ? "✓" : "×"}
              </span>
              {t(check.id as "checkLength")}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-5 text-xs leading-relaxed text-muted">{t("note")}</p>
    </div>
  );
}