"use client";

import { useTranslations } from "next-intl";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const t = useTranslations("Brand");
  const icon = size === "lg" ? "h-9 w-9" : "h-7 w-7";
  const title = size === "lg" ? "text-[17px]" : "text-[15px]";
  const tag = size === "lg" ? "text-[10px]" : "text-[9px]";

  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden="true" className={`grid ${icon} place-items-center`}>
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect
            x="0.5"
            y="0.5"
            width="63"
            height="63"
            rx="14"
            fill="var(--logo-bg)"
            stroke="var(--logo-stroke)"
          />
          <rect x="14" y="18" width="40" height="5" rx="2.5" fill="var(--logo-bar)" />
          <rect
            x="14"
            y="29"
            width="28"
            height="5"
            rx="2.5"
            fill="var(--logo-bar)"
            opacity="0.55"
          />
          <rect
            x="14"
            y="40"
            width="34"
            height="5"
            rx="2.5"
            fill="var(--logo-bar)"
            opacity="0.3"
          />
          <rect
            x="14"
            y="51"
            width="20"
            height="5"
            rx="2.5"
            fill="var(--logo-bar)"
            opacity="0.15"
          />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block ${title} tracking-tight`}>
          <span className="font-semibold text-text">freetools</span>
          <span className="font-extrabold text-accent">Y</span>
        </span>
        <span className={`hidden ${tag} font-medium uppercase tracking-[0.18em] text-faint sm:block`}>
          {t("tagline")}
        </span>
      </span>
    </span>
  );
}