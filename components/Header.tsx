"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useMessages, useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";
import Logo from "./Logo";
import CategoryIcon from "./CategoryIcon";
import ToolIcon from "./ToolIcon";
import SearchOverlay from "./SearchOverlay";
import { categoryTheme } from "./categoryTheme";
import { categories, displayToolCount, getToolsByCategory, tools } from "@/data/tools";
import { categoryPath, toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";

type ToolMetaNs = { name?: string };

const pageLinks = [
  { href: "/rehber", key: "guides" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/privacy-policy", key: "privacy" },
] as const;

const label = "font-mono text-[11px] uppercase tracking-[0.2em] text-faint";

const HOVER_OPEN_DELAY = 150;
const HOVER_CLOSE_DELAY = 250;

function supportsHover() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinnedRef = useRef<string | null>(null);
  const pointerFocusRef = useRef(false);
  const t = useTranslations("Header");
  const tc = useTranslations("Categories");
  const tf = useTranslations("Footer");
  const locale = useLocale() as Locale;
  const messages = useMessages() as { ToolMeta?: Record<string, ToolMetaNs> };
  const meta = messages.ToolMeta;

  const closeMenus = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    pinnedRef.current = null;
    setOpenMenu(null);
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (
        headerRef.current &&
        headerRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
      closeMenus();
    }
    function onPointerUp() {
      pointerFocusRef.current = false;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      closeMenus();
      setMobileOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("keydown", onKeyDown);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [closeMenus]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.documentElement.style.overflow;
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  function clearTimers() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function toggleMenu(id: string) {
    clearTimers();
    if (openMenu === id) {
      pinnedRef.current = null;
      setOpenMenu(null);
      return;
    }
    pinnedRef.current = id;
    setOpenMenu(id);
  }

  function hoverOpen(id: string) {
    if (!supportsHover()) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      if (pinnedRef.current !== id) pinnedRef.current = null;
      setOpenMenu(id);
    }, HOVER_OPEN_DELAY);
  }

  function hoverClose(id: string) {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      if (pinnedRef.current === id) return;
      setOpenMenu((current) => (current === id ? null : current));
    }, HOVER_CLOSE_DELAY);
  }

  function focusOpen(id: string) {
    clearTimers();
    pinnedRef.current = null;
    setOpenMenu(id);
  }

  function focusClose(id: string) {
    clearTimers();
    if (pinnedRef.current === id) return;
    setOpenMenu((current) => (current === id ? null : current));
  }

  function closeAll() {
    closeMenus();
    setMobileOpen(false);
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm"
      >
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:h-16 sm:px-6">
          <Link href="/" aria-label="FreetoolsY" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden flex-1 items-center lg:flex">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onPointerDown={() => {
                  pointerFocusRef.current = true;
                }}
                onMouseEnter={() => hoverOpen(category.id)}
                onMouseLeave={() => hoverClose(category.id)}
                onFocus={(event) => {
                  if (pointerFocusRef.current) return;
                  if (!event.currentTarget.contains(event.target as Node))
                    return;
                  focusOpen(category.id);
                }}
                onBlur={(event) => {
                  if (
                    event.currentTarget.contains(event.relatedTarget as Node)
                  )
                    return;
                  focusClose(category.id);
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleMenu(category.id)}
                  aria-expanded={openMenu === category.id}
                  className="group flex h-16 items-center gap-1.5 border-b-2 border-transparent px-3 text-sm text-muted transition-colors hover:border-foreground hover:text-foreground"
                >
                  <CategoryIcon
                    id={category.id}
                    className={`h-4 w-4 shrink-0 ${categoryTheme(category.id).iconText}`}
                  />
                  {tc(category.id)}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 transition-transform ${
                      openMenu === category.id ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openMenu === category.id && (
                  <div
                    className="fancy-scroll absolute left-0 top-full z-10 max-h-[70vh] w-64 overflow-y-auto overscroll-contain border border-t-0 border-border bg-surface py-1"
                  >
                    {getToolsByCategory(category.id).map((tool) => (
                      <Link
                        key={tool.slug}
                        href={toolPath(locale, tool.slug)}
                        onClick={closeAll}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                      >
                        <ToolIcon
                          id={tool.slug}
                          className={`h-4 w-4 shrink-0 ${categoryTheme(category.id).iconText}`}
                        />
                        {meta?.[tool.slug]?.name ?? tool.slug}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
              aria-label={t("searchLabel")}
              className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-strong hover:text-text"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
            </button>

            <span className="hidden lg:contents">
              <LocaleSwitcher />
            </span>
            <span className="hidden lg:contents">
              <ThemeToggle />
            </span>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-label={t("categories")}
              className="grid h-12 w-12 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-strong hover:text-text lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="h-5 w-5"
              >
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        </header>

      {mobileOpen && (
        <div
          ref={menuRef}
          className="fixed inset-x-0 bottom-0 top-14 z-50 border-t border-border bg-bg shadow-card sm:top-16 lg:hidden"
        >
          <div className="h-full overflow-y-auto overscroll-contain pb-8">
            <Link
              href="/#tools-explorer"
              onClick={closeAll}
              className="flex min-h-12 items-center justify-between gap-2 border-y border-border px-4 text-sm font-medium text-foreground active:bg-surface-2"
            >
              {t("allTools")}
              <span className="font-mono text-[11px] tabular-nums text-faint">
                {displayToolCount(tools.length)}
              </span>
            </Link>

            <p className={`${label} px-4 pb-2 pt-5`}>{t("categories")}</p>
            <ul className="grid grid-cols-2 gap-px border-y border-border bg-border">
              {categories.map((category) => (
                <li key={category.id} className="bg-bg">
                  <Link
                    href={categoryPath(locale, category.id)}
                    onClick={closeAll}
                    className="flex min-h-12 items-center justify-between gap-2 px-4 text-sm text-muted active:bg-surface-2"
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon
                        id={category.id}
                        className={`h-4 w-4 shrink-0 ${categoryTheme(category.id).iconText}`}
                      />
                      {tc(category.id)}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-faint">
                      {getToolsByCategory(category.id).length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="border-b border-border">
              {pageLinks.map((link) => (
                <li key={link.href} className="border-t border-border first:border-t-0">
                  <Link
                    href={link.href}
                    onClick={closeAll}
                    className="flex min-h-12 items-center px-4 text-sm text-muted active:bg-surface-2"
                  >
                    {tf(link.key)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
