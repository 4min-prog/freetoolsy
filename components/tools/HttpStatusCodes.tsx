"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

type StatusGroup = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

const STATUS_CODES: { code: number; group: StatusGroup; title: string }[] = [
  { code: 100, group: "1xx", title: "Continue" },
  { code: 101, group: "1xx", title: "Switching Protocols" },
  { code: 102, group: "1xx", title: "Processing" },
  { code: 103, group: "1xx", title: "Early Hints" },
  { code: 200, group: "2xx", title: "OK" },
  { code: 201, group: "2xx", title: "Created" },
  { code: 202, group: "2xx", title: "Accepted" },
  { code: 203, group: "2xx", title: "Non-Authoritative Information" },
  { code: 204, group: "2xx", title: "No Content" },
  { code: 205, group: "2xx", title: "Reset Content" },
  { code: 206, group: "2xx", title: "Partial Content" },
  { code: 207, group: "2xx", title: "Multi-Status" },
  { code: 208, group: "2xx", title: "Already Reported" },
  { code: 226, group: "2xx", title: "IM Used" },
  { code: 300, group: "3xx", title: "Multiple Choices" },
  { code: 301, group: "3xx", title: "Moved Permanently" },
  { code: 302, group: "3xx", title: "Found" },
  { code: 303, group: "3xx", title: "See Other" },
  { code: 304, group: "3xx", title: "Not Modified" },
  { code: 307, group: "3xx", title: "Temporary Redirect" },
  { code: 308, group: "3xx", title: "Permanent Redirect" },
  { code: 400, group: "4xx", title: "Bad Request" },
  { code: 401, group: "4xx", title: "Unauthorized" },
  { code: 402, group: "4xx", title: "Payment Required" },
  { code: 403, group: "4xx", title: "Forbidden" },
  { code: 404, group: "4xx", title: "Not Found" },
  { code: 405, group: "4xx", title: "Method Not Allowed" },
  { code: 406, group: "4xx", title: "Not Acceptable" },
  { code: 407, group: "4xx", title: "Proxy Authentication Required" },
  { code: 408, group: "4xx", title: "Request Timeout" },
  { code: 409, group: "4xx", title: "Conflict" },
  { code: 410, group: "4xx", title: "Gone" },
  { code: 411, group: "4xx", title: "Length Required" },
  { code: 412, group: "4xx", title: "Precondition Failed" },
  { code: 413, group: "4xx", title: "Payload Too Large" },
  { code: 414, group: "4xx", title: "URI Too Long" },
  { code: 415, group: "4xx", title: "Unsupported Media Type" },
  { code: 416, group: "4xx", title: "Range Not Satisfiable" },
  { code: 417, group: "4xx", title: "Expectation Failed" },
  { code: 418, group: "4xx", title: "I'm a Teapot" },
  { code: 422, group: "4xx", title: "Unprocessable Entity" },
  { code: 425, group: "4xx", title: "Too Early" },
  { code: 426, group: "4xx", title: "Upgrade Required" },
  { code: 429, group: "4xx", title: "Too Many Requests" },
  { code: 431, group: "4xx", title: "Request Header Fields Too Large" },
  { code: 451, group: "4xx", title: "Unavailable For Legal Reasons" },
  { code: 500, group: "5xx", title: "Internal Server Error" },
  { code: 501, group: "5xx", title: "Not Implemented" },
  { code: 502, group: "5xx", title: "Bad Gateway" },
  { code: 503, group: "5xx", title: "Service Unavailable" },
  { code: 504, group: "5xx", title: "Gateway Timeout" },
  { code: 505, group: "5xx", title: "HTTP Version Not Supported" },
  { code: 506, group: "5xx", title: "Variant Also Negotiates" },
  { code: 507, group: "5xx", title: "Insufficient Storage" },
  { code: 508, group: "5xx", title: "Loop Detected" },
  { code: 510, group: "5xx", title: "Not Extended" },
  { code: 511, group: "5xx", title: "Network Authentication Required" },
];

const GROUP_ORDER: StatusGroup[] = ["1xx", "2xx", "3xx", "4xx", "5xx"];

export default function HttpStatusCodes() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const t = useTranslations("comp.httpStatusCodes");

  async function copy(code: number) {
    try {
      await navigator.clipboard.writeText(String(code));
      setCopied(code);
      showToast();
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  function clear() {
    setQuery("");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STATUS_CODES;
    return STATUS_CODES.filter(
      (entry) =>
        String(entry.code).includes(q) ||
        entry.title.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <label
        htmlFor="status-search"
        className="block text-sm font-medium text-text"
      >
        {t("searchLabel")}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <input
          id="status-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={clear}
          disabled={!query}
          className="shrink-0 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text disabled:opacity-50"
        >
          {t("clear")}
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {GROUP_ORDER.map((group) => {
          const entries = filtered.filter((entry) => entry.group === group);
          if (entries.length === 0) return null;
          return (
            <div key={group}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                {group} · {t(`group${group}`)}
              </h2>
              <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
                {entries.map((entry) => (
                  <li
                    key={entry.code}
                    className="flex items-center gap-3 px-3.5 py-2 text-sm"
                  >
                    <span className="w-12 shrink-0 font-semibold tabular-nums text-accent">
                      {entry.code}
                    </span>
                    <span className="flex-1 text-text">{entry.title}</span>
                    <button
                      type="button"
                      onClick={() => copy(entry.code)}
                      className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-text"
                    >
                      {copied === entry.code ? t("copied") : t("copy")}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted">
            {t("noResults")}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}