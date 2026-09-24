"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import ToolIcon from "@/components/ToolIcon";
import { POPULAR_SLUGS } from "@/data/popular";
import { tools } from "@/data/tools";
import { track } from "@/lib/analytics";

interface ToolMetaNs {
  name?: string;
  desc?: string;
}

export default function SearchBox({
  placeholder,
  autoFocus,
  large,
  onDone,
  onEsc,
}: {
  placeholder: string;
  autoFocus?: boolean;
  large?: boolean;
  onDone?: () => void;
  onEsc?: () => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const resultsId = useId();
  const router = useRouter();
  const t = useTranslations("Header");
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
    const target = matches[activeIndex] ?? matches[0];
    if (target) {
      go(target.slug);
      return;
    }
    const query = q.trim();
    if (query) {
      onDone?.();
      router.push(`/?q=${encodeURIComponent(query)}`);
      setTimeout(
        () => window.dispatchEvent(new Event("freetoolsy:search")),
        80
      );
    }
  }

  const showResults = open && Boolean(normalized) && matches.length > 0;
  const showFallback = open && (!normalized || matches.length === 0);
  const popularSlugs = useMemo(
    () =>
      POPULAR_SLUGS.filter((slug) => tools.some((tool) => tool.slug === slug)).slice(
        0,
        4
      ),
    []
  );
  const suggestions = popularSlugs;
  const mostSearched = popularSlugs.map((slug) => meta?.[slug]?.name ?? slug);

  function searchQuery(query: string) {
    setQ("");
    setOpen(false);
    onDone?.();
    track("search", { search_term: query });
    router.push(`/?q=${encodeURIComponent(query)}`);
    setTimeout(
      () => window.dispatchEvent(new Event("freetoolsy:search")),
      80
    );
  }

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
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-faint ${
          large ? "left-4 h-5 w-5" : "left-3 h-4 w-4"
        }`}
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
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (matches.length > 0) {
              setActiveIndex((value) => (value + 1) % matches.length);
              setOpen(true);
            }
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (matches.length > 0) {
              setActiveIndex(
                (value) => (value - 1 + matches.length) % matches.length
              );
              setOpen(true);
            }
          } else if (event.key === "Enter") {
            submit();
          } else if (event.key === "Escape") {
            if (open) setOpen(false);
            else onEsc?.();
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-expanded={showResults || showFallback}
        aria-controls={resultsId}
        aria-activedescendant={
          showResults ? `${resultsId}-${activeIndex}` : undefined
        }
        role="combobox"
        className={`w-full border-border bg-surface text-text placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 ${
          large
            ? "rounded-xl border py-3.5 pl-11 pr-4 text-base shadow-card"
            : "rounded-lg border py-2 pl-9 pr-3 text-sm"
        }`}
      />
      {showResults && (
        <ul
          role="listbox"
          id={resultsId}
          aria-label={placeholder}
          className="fancy-scroll absolute left-0 right-0 top-full z-50 mt-1.5 max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-1 shadow-card-hover"
        >
          {matches.map((match, index) => (
            <li
              key={match.slug}
              id={`${resultsId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <Link
                href={`/araclar/${match.slug}`}
                onClick={close}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  index === activeIndex
                    ? "bg-surface-2 text-text"
                    : "text-muted hover:bg-surface-2 hover:text-text"
                }`}
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
      {showFallback && (
        <ul
          role="listbox"
          id={resultsId}
          aria-label={placeholder}
          className="fancy-scroll absolute left-0 right-0 top-full z-50 mt-1.5 max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-1 shadow-card-hover"
        >
          {Boolean(normalized) && (
            <li role="option" aria-selected="false">
              <span className="block rounded-lg px-3 py-2 text-sm text-muted">
                {t("noResults")}
              </span>
            </li>
          )}
          <li role="option" aria-selected="false">
            <span className="mt-1 block px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-faint">
              {t("searchSuggestions")}
            </span>
          </li>
          {suggestions.map((slug) => (
            <li key={slug} role="option" aria-selected="false">
              <Link
                href={`/araclar/${slug}`}
                onClick={close}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
                <ToolIcon id={slug} className="h-4 w-4 shrink-0 text-accent" />
                <span className="truncate">
                  {meta?.[slug]?.name ?? slug}
                </span>
              </Link>
            </li>
          ))}
          <li role="option" aria-selected="false">
            <span className="mt-2 block px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-faint">
              {t("mostSearched")}
            </span>
          </li>
          <li role="option" aria-selected="false">
            <div className="flex flex-wrap gap-1.5 px-3 pb-2 pt-1">
              {mostSearched.map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => searchQuery(query)}
                  className="rounded-full border border-border/70 bg-surface px-3 py-1 text-xs text-muted transition-colors hover:border-accent/40 hover:text-text"
                >
                  {query}
                </button>
              ))}
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}