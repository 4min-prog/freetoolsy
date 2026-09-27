"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const TLD_SET = new Set(
  [
    "com", "net", "org", "edu", "gov", "int", "mil",
    "io", "co", "dev", "app", "info", "biz", "tv", "me", "site", "online",
    "us", "uk", "tr", "de", "fr", "it", "es", "nl", "be", "at", "ch", "pt", "pl", "cz",
    "dk", "fi", "no", "se", "ie", "gr", "ro", "bg", "hu", "sk", "si", "hr", "rs",
    "ua", "ru", "by", "kz", "az", "ge", "am", "md", "lt", "lv", "ee",
    "br", "ar", "mx", "cl", "co", "pe", "uy", "ec", "ve",
    "cn", "jp", "kr", "in", "id", "ph", "th", "vn", "my", "sg", "hk", "tw", "au", "nz",
    "za", "eg", "ma", "ng", "ke",
    "email", "shop", "store", "blog", "xyz", "top", "club", "world", "live", "cloud",
  ].map((tld) => tld.toLowerCase())
);

const ROLE_WORDS = [
  "info", "admin", "support", "sales", "contact", "hello", "office", "service", "mail", "webmaster", "no-reply", "noreply",
];

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/;

function validate(email: string): { valid: boolean; tld: string | null; role: boolean } {
  const value = email.trim().replace(/^[<>\[\]'"\s]+|[<>\[\]'"\s]+$/g, "").toLowerCase();
  const match = EMAIL_REGEX.exec(value);
  if (!match) return { valid: false, tld: null, role: false };
  const [, domain] = match;
  const tldMatch = /\.([a-z]{2,24})$/.exec(domain);
  const tld = tldMatch?.[1] ?? null;
  if (!tld || !TLD_SET.has(tld)) return { valid: false, tld, role: false };
  const local = value.split("@")[0];
  const role = ROLE_WORDS.some((word) => local.startsWith(word));
  return { valid: true, tld, role };
}

export default function EmailValidator() {
  const [input, setInput] = useState("");
  const t = useTranslations("comp.emailValidator");

  const emails = useMemo(
    () =>
      input
        .split(/[\r\n,;\s]+/)
        .map((email) => email.trim())
        .filter(Boolean),
    [input]
  );

  const results = useMemo(() => emails.map((email) => ({ email, ...validate(email) })), [emails]);

  return (
    <div>
      <label htmlFor="email-input" className="block text-sm font-medium text-text">
        {t("emails")}
      </label>
      <textarea
        id="email-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mt-2 h-36 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {results.length > 0 && (
        <ul className="mt-6 space-y-2">
          {results.map((result, index) => (
            <li
              key={`${result.email}-${index}`}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm"
            >
              <span className={result.valid ? "text-text" : "text-red-600"}>
                {result.email}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                  result.valid
                    ? "bg-emerald-600/10 text-emerald-700"
                    : "bg-red-600/10 text-red-700"
                }`}
              >
                {result.valid ? t("valid") : t("invalid")}
              </span>
              {result.valid && (
                <span className="text-xs text-muted">
                  .{result.tld}
                  {result.role ? ` · ${t("roleNote")}` : ""}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}