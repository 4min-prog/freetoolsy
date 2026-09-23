"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";
import CategoryIcon from "./CategoryIcon";
import SearchBox from "./SearchBox";
import { categories } from "@/data/tools";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const t = useTranslations("Header");
  const tc = useTranslations("Categories");

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setMobileSearchOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-md bg-accent text-sm font-semibold text-on-accent"
          >
            F
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-text">
            FreetoolsY
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 md:gap-2">
          <div className="hidden lg:flex items-center gap-0.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/#${category.id}`}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-text"
              >
                {tc(category.id)}
              </Link>
            ))}
          </div>

          <div className="relative hidden md:block w-36 xl:w-48">
            <SearchBox placeholder={t("searchPlaceholder")} />
          </div>

          <button
            type="button"
            onClick={() => setMobileSearchOpen((value) => !value)}
            aria-label={t("searchLabel")}
            aria-expanded={mobileSearchOpen}
            className="rounded-md p-2.5 text-muted transition-colors hover:text-text md:hidden"
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

          <div className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-haspopup="true"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:text-text"
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
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-1.5 grid w-72 max-w-[calc(100vw-2rem)] grid-cols-2 gap-1.5 rounded-xl border border-border bg-surface p-1.5 shadow-card-hover"
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/#${category.id}`}
                    role="menuitem"
                    onClick={() => setOpen(false)}
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

          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-border px-4 py-3 sm:px-6 md:hidden">
          <SearchBox
            autoFocus
            placeholder={t("searchPlaceholder")}
            onDone={() => setMobileSearchOpen(false)}
            onEsc={() => setMobileSearchOpen(false)}
          />
        </div>
      )}
    </header>
  );
}