"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useMessages, useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";
import Logo from "./Logo";
import CategoryIcon from "./CategoryIcon";
import ToolIcon from "./ToolIcon";
import SearchOverlay from "./SearchOverlay";
import { categoryTheme } from "./categoryTheme";
import { categories, getToolsByCategory, tools } from "@/data/tools";

type ToolMetaNs = { name?: string };

const pageLinks = [
  { href: "/rehber", key: "guides" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/privacy-policy", key: "privacy" },
] as const;

const label = "font-mono text-[11px] uppercase tracking-[0.2em] text-faint";

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const t = useTranslations("Header");
  const tc = useTranslations("Categories");
  const tf = useTranslations("Footer");
  const messages = useMessages() as { ToolMeta?: Record<string, ToolMetaNs> };
  const meta = messages.ToolMeta;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  function toggleMenu(id: string) {
    setOpenMenu((value) => (value === id ? null : id));
  }

  function closeAll() {
    setOpenMenu(null);
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
              <div key={category.id} className="relative">
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
                        href={`/araclar/${tool.slug}`}
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
              onClick={() => setSearchOpen(true)}
              aria-label={t("searchLabel")}
              className="grid h-10 w-10 place-items-center border border-border text-muted transition-colors hover:border-foreground hover:text-foreground"
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

            <LocaleSwitcher />
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-label={t("categories")}
              className="grid h-10 w-10 place-items-center border border-border text-muted transition-colors hover:border-foreground hover:text-foreground lg:hidden"
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

        {mobileOpen && (
          <div className="border-t border-border bg-bg lg:hidden">
            <div className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain pb-8">
              <Link
                href="/#tools-explorer"
                onClick={closeAll}
                className="flex min-h-12 items-center justify-between gap-2 border-y border-border px-4 text-sm font-medium text-foreground active:bg-surface-2"
              >
                {t("allTools")}
                <span className="font-mono text-[11px] tabular-nums text-faint">
                  {tools.length}
                </span>
              </Link>

              <p className={`${label} px-4 pb-2 pt-5`}>{t("categories")}</p>
              <ul className="grid grid-cols-2 gap-px border-y border-border bg-border">
                {categories.map((category) => (
                  <li key={category.id} className="bg-bg">
                    <Link
                      href={`/#${category.id}`}
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
            </div>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
