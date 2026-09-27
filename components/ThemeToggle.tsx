"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("ThemeToggle");

  useEffect(() => {
    let initial: boolean;
    try {
      initial = localStorage.theme === "dark";
    } catch {
      initial = false;
    }
    document.documentElement.classList.toggle("dark", initial);
    setMounted(true);
    setDark(initial);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.theme = next ? "dark" : "light";
      setMounted(true);
    } catch {
      // localStorage unavailable
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={mounted && dark ? t("toLight") : t("toDark")}
      onClick={toggle}
      className="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-surface transition-colors hover:border-strong"
    >
      <span
        aria-hidden="true"
        className="flex w-full items-center justify-between rounded-full px-2 text-faint"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>
      <span
        aria-hidden="true"
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-text shadow-sm transition-transform duration-200 ${
          dark ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}