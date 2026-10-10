"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

const BRAND_RULES: [RegExp, string][] = [
  [/^4[0-9]{12,18}$/, "Visa"],
  [/^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$/, "Mastercard"],
  [/^3[47][0-9]{13}$/, "American Express"],
  [/^(6011|65)[0-9]{12,15}$/, "Discover"],
  [/^(5018|5020|5038|5893|6304|6759|6761|6762|6763)[0-9]{8,15}$/, "Maestro"],
  [/^35(2[89]|[3-8][0-9])[0-9]{12,15}$/, "JCB"],
];

function luhnValid(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let value = digits.charCodeAt(i) - 48;
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
}

function detectBrand(digits: string): string {
  for (const [pattern, name] of BRAND_RULES) {
    if (pattern.test(digits)) return name;
  }
  return "";
}

function groupDigits(digits: string): string {
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export default function CreditCardValidator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const t = useTranslations("comp.creditCardValidator");

  const digits = input.replace(/[\s.-]/g, "");
  const numeric = /^[0-9]{13,19}$/.test(digits);
  const isValid = numeric && luhnValid(digits);
  const grouped = groupDigits(digits);

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
    setInput("");
    setCopied(false);
  }

  return (
    <div>
      <div>
        <label htmlFor="cc-input" className="block text-sm font-medium text-text">
          {t("inputLabel")}
        </label>
        <input
          id="cc-input"
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t("inputPlaceholder")}
          className="mt-2 w-full max-w-md rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {numeric ? (
        <div
          className={`mt-5 rounded-lg border p-4 ${
            isValid ? "border-success/40 bg-success/10" : "border-danger/40 bg-danger/10"
          }`}
        >
          <p className={`text-sm font-medium ${isValid ? "text-success" : "text-danger"}`}>
            {isValid ? t("valid") : t("invalid")}
          </p>
          {isValid ? (
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>
                {t("brand")}: {detectBrand(digits) || t("unknownBrand")}
              </li>
              <li>
                {t("length")}: {digits.length}
              </li>
              <li>
                {t("grouped")}: {grouped}
              </li>
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => copy(grouped)}
          disabled={!numeric}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {copied ? t("copied") : t("copy")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={!input}
          className="rounded-lg border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}
