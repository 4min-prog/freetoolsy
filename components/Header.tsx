"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useMessages } from "next-intl";
import { useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";
import Logo from "./Logo";
import CategoryIcon from "./CategoryIcon";
import ToolIcon from "./ToolIcon";
import SearchOverlay from "./SearchOverlay";
import { categoryTheme } from "./categoryTheme";
import { categories, getToolsByCategory } from "@/data/tools";

type ToolMetaNs = { name?: string };

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const t = useTranslations("Header");
  const tc = useTranslations("Categories");
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
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function toggleMenu(id: string) {
    setOpenMenu((value) => (value === id ? null : id));
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-border bg-bg transition-colors"
      >
        <div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between gap-2 px-4 sm:px-6 md:justify-center">
          <Link href="/" aria-label="FreetoolsY">
            <Logo size="lg" />
          </Link>

          <nav className="flex items-center gap-1 md:gap-2">
            <div className="hidden md:flex items-center gap-1 md:gap-2">
              {categories.map((category) => (
                <div key={category.id} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu(category.id)}
                    aria-expanded={openMenu === category.id}
                    aria-haspopup="menu"
                    className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[15px] text-muted transition-colors hover:text-text"
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openMenu === category.id ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {openMenu === category.id && (
                    <div
                      role="menu"
                      className="fancy-scroll absolute left-0 mt-1.5 w-64 max-h-[200px] overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-1.5 shadow-card-hover"
                    >
                      {getToolsByCategory(category.id).map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/araclar/${tool.slug}`}
                          role="menuitem"
                          onClick={() => setOpenMenu(null)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
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
            </div>

            <div className="relative lg:hidden">
              <button
                type="button"
                onClick={() => toggleMenu("__mobile")}
                aria-expanded={openMenu === "__mobile"}
                aria-haspopup="true"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[15px] text-muted transition-colors hover:text-text"
              >
                {t("categories")}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openMenu === "__mobile" ? "rotate-180" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openMenu === "__mobile" && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1.5 grid w-72 max-w-[calc(100vw-2rem)] grid-cols-2 gap-1.5 rounded-xl border border-border bg-surface p-1.5 shadow-card-hover"
                >
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/#${category.id}`}
                      role="menuitem"
                      onClick={() => setOpenMenu(null)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
                    >
                      <CategoryIcon
                        id={category.id}
                        className="h-4 w-4 shrink-0 text-accent"
                      />
                      {tc(category.id)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t("searchLabel")}
              className="rounded-md p-3 text-muted transition-colors hover:text-text"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-6 w-6"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
            </button>

            <LocaleSwitcher />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}