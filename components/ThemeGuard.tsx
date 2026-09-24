"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function resolveTheme(): boolean {
  try {
    return localStorage.theme === "dark";
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