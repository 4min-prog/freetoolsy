"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toolUse } from "@/lib/analytics";
import { getActiveTool } from "@/lib/toolContext";

export default function ToastHost() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const t = useTranslations("Toast");

  useEffect(() => {
    function handler(event: Event) {
      const detail = (event as CustomEvent<{ action?: string }>).detail;
      const action = detail?.action ?? "copy";
      setMessage(
        action === "download"
          ? t("downloaded")
          : action === "sample"
            ? t("sampleLoaded")
            : t("copied")
      );
      const slug = getActiveTool();
      if (slug) toolUse(slug, action);
      setVisible(true);
      window.setTimeout(() => setVisible(false), 2000);
    }
    window.addEventListener("freetoolsy:toast", handler);
    return () => window.removeEventListener("freetoolsy:toast", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-card-hover fade-in-up">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {message}
      </div>
    </div>
  );
}