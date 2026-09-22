"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";
import CategoryIcon from "./CategoryIcon";
import { categories } from "@/data/tools";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("Header");
  const tc = useTranslations("Categories");

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function focusSearch() {
    const el = document.getElementById("arac-ara");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      (el as HTMLInputElement).focus();
      return;
    }
    router.push("/");
    setTimeout(() => {
      const target = document.getElementById("arac-ara");
      (target as HTMLInputElement | null)?.focus();
    }, 400);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
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

        <nav className="ml-auto flex items-center gap-1">
          <div ref={dropdownRef} className="relative">
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
                className="absolute right-0 mt-1.5 w-52 rounded-xl border border-border bg-surface p-1.5 shadow-card-hover"
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/#${category.id}`}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    <CategoryIcon id={category.id} className="h-4 w-4 text-accent" />
                    {tc(category.id)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={focusSearch}
            aria-label={t("searchLabel")}
            className="rounded-md p-2 text-muted transition-colors hover:text-text"
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
        </nav>
      </div>
    </header>
  );
}