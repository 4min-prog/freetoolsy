"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function resolveTheme(): boolean {
  try {
    if (localStorage.theme !== undefined) {
      return localStorage.theme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export default function ThemeGuard() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", resolveTheme());
  }, [pathname]);

  return null;
}