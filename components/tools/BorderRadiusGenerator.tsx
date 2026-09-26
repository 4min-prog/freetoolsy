"use client";

import { showToast } from "@/lib/toast";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function BorderRadiusGenerator() {
  const t = useTranslations("comp.borderRadiusGenerator");
  const [linked, setLinked] = useState(true);
  const [tl, setTl] = useState(20);
  const [tr, setTr] = useState(20);
  const [br, setBr] = useState(20);
  const [bl, setBl] = useState(20);
  const [copied, setCopied] = useState(false);

  const values = { tl, tr, br, bl };

  function update(key: "tl" | "tr" | "br" | "bl", value: number) {
    if (linked) {
      setTl(value);
      setTr(value);
      setBr(value);
      setBl(value);
    } else if (key === "tl") setTl(value);
    else if (key === "tr") setTr(value);
    else if (key === "br") setBr(value);
    else setBl(value);
  }

  const css = useMemo(() => {
    const all = [tl, tr, br, bl];
    const uniform = all.every((value) => value === all[0]);
    return uniform
      ? `border-radius: ${tl}px;`
      : `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;
  }, [tl, tr, br, bl]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      showToast();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const rows: { key: "tl" | "tr" | "br" | "bl"; label: string }[] = [
    { key: "tl", label: t("tl") },
    { key: "tr", label: t("tr") },
    { key: "br", label: t("br") },
    { key: "bl", label: t("bl") },
  ];

  return (
    <div>
      <div className="grid gap-4">
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            {t("previewTitle")}
          </p>
          <div className="flex min-h-40 items-center justify-center py-4">
            <div
              className="h-28 w-28 border-2 border-accent"
              style={{ borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-strong">
          <input
            type="checkbox"
            checked={linked}
            onChange={(event) => setLinked(event.target.checked)}
            className="h-4 w-4 accent-[--color-accent]"
          />
          {t("linked")}
        </label>

        {rows.map((row) => (
          <div key={row.key}>
            <label
              htmlFor={`radius-${row.key}`}
              className="flex items-center justify-between text-sm font-medium text-text"
            >
              <span>{row.label}</span>
              <span className="text-xs tabular-nums text-faint">
                {values[row.key]}px
              </span>
            </label>
            <input
              id={`radius-${row.key}`}
              type="range"
              min={0}
              max={200}
              value={values[row.key]}
              onChange={(event) =>
                update(row.key, Number(event.target.value))
              }
              className="mt-2 w-full accent-[--color-accent]"
            />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            {t("cssLabel")}
          </p>
          <button
            type="button"
            onClick={copy}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface-2/50 p-4 font-mono text-xs leading-relaxed text-text">
          {css}
        </pre>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("tip")}</p>
    </div>
  );
}