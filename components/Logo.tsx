"use client";

import { useTranslations } from "next-intl";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const t = useTranslations("Brand");
  const icon = size === "lg" ? "h-12 w-12" : "h-12 w-12";

  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden="true" className={`grid ${icon} place-items-center`}>
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="14" y="18" width="40" height="5" fill="var(--logo-bar)" />
          <rect
            x="14"
            y="29"
            width="28"
            height="5"
            fill="var(--logo-bar)"
            opacity="0.55"
          />
          <rect
            x="14"
            y="40"
            width="34"
            height="5"
            fill="var(--logo-bar)"
            opacity="0.3"
          />
          <rect
            x="14"
            y="51"
            width="20"
            height="5"
            fill="var(--logo-bar)"
            opacity="0.15"
          />
        </svg>
      </span>
      <span className="hidden leading-tight min-[420px]:block">
        <span className="block text-[15px] tracking-tight">
          <span className="font-semibold text-text">freetools</span>
          <span className="font-extrabold text-accent">Y</span>
        </span>
        <span className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-faint sm:block">
          {t("tagline")}
        </span>
      </span>
    </span>
  );
}