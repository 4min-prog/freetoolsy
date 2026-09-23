"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useMessages } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import ToolIcon from "@/components/ToolIcon";
import { tools } from "@/data/tools";

interface ToolMetaNs {
  name?: string;
  desc?: string;
}

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
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const resultsId = useId();
  const router = useRouter();
  const messages = useMessages();
  const meta = messages.ToolMeta as Record<string, ToolMetaNs> | undefined;

  const normalized = q.trim().toLocaleLowerCase();

  const matches = useMemo(() => {
    if (!normalized) return [];
    return tools
      .filter((tool) => {
        const name = meta ? meta[tool.slug]?.name ?? "" : tool.slug;
        const desc = meta ? meta[tool.slug]?.desc ?? "" : "";
        return [name, desc, tool.slug, tool.category]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalized);
      })
      .slice(0, 8);
  }, [normalized, meta]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function close() {
    setOpen(false);
    onDone?.();
  }

  function go(slug: string) {
    setQ("");
    setOpen(false);
    onDone?.();
    router.push(`/araclar/${slug}`);
  }

  function submit() {
    const first = matches[0];
    if (first) {
      go(first.slug);
      return;
    }
    const query = q.trim();
    if (query) {
      onDone?.();
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  }

  const showResults = open && Boolean(normalized) && matches.length > 0;

  return (
    <div ref={boxRef} className="relative">
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
        onChange={(event) => {
          setQ(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit();
          if (event.key === "Escape") {
            if (open) setOpen(false);
            else onEsc?.();
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-expanded={showResults}
        aria-controls={resultsId}
        role="combobox"
        className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {showResults && (
        <ul
          role="listbox"
          id={resultsId}
          aria-label={placeholder}
          className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-card-hover"
        >
          {matches.map((match) => (
            <li key={match.slug}>
              <Link
                href={`/araclar/${match.slug}`}
                onClick={close}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
                <ToolIcon
                  id={match.slug}
                  className="h-4 w-4 shrink-0 text-accent"
                />
                <span className="truncate">
                  {meta?.[match.slug]?.name ?? match.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}