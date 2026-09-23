"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export default function SearchBox({
  placeholder,
  autoFocus,
  onDone,
  onEsc,
}: {
  placeholder: string;
  autoFocus?: boolean;
  onDone?: () => void;
  onEsc?: () => void;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit() {
    const query = q.trim();
    if (!query) return;
    onDone?.();
    router.push(`/?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.2-3.2" />
      </svg>
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(event) => setQ(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit();
          if (event.key === "Escape") onEsc?.();
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}