"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { toolPath } from "@/lib/paths";
import type { Locale } from "@/i18n/routing";

type Item = { slug: string; name: string };
type Names = Record<string, { name?: string } | undefined>;

export default function HeroMarquee({
  columns,
  locale,
  names,
}: {
  columns: Item[][];
  locale: Locale;
  names: Names | undefined;
}) {
  const refs = useRef<(HTMLUListElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLUListElement[];

    for (const el of els) {
      const source = Array.from(el.children) as HTMLElement[];
      for (const li of source) {
        const clone = li.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("data-marquee-clone", "");
        clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
        el.appendChild(clone);
      }
    }

    return () => {
      for (const el of els) {
        el.querySelectorAll("[data-marquee-clone]").forEach((n) => n.remove());
      }
    };
  }, []);

  return (
    <div className="hero-marquee-mask mt-4 flex h-[22rem] gap-5 overflow-hidden">
      {columns.map((column, columnIndex) => (
        <ul
          key={columnIndex}
          ref={(el) => {
            refs.current[columnIndex] = el;
          }}
          className={
            columnIndex === 0
              ? "hero-marquee w-1/2 shrink-0 space-y-2.5"
              : "hero-marquee-reverse w-1/2 shrink-0 space-y-2.5"
          }
        >
          {column.map((tool, index) => (
            <li key={`${tool.slug}-${index}`}>
              <Link
                href={toolPath(locale, tool.slug)}
                className="group flex items-baseline gap-2 font-mono text-xs text-muted transition-colors hover:text-foreground"
              >
                <span className="w-6 shrink-0 text-right text-[10px] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate group-hover:underline">
                  {names?.[tool.slug]?.name ?? tool.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
