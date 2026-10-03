"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const t = useTranslations("Brand");
  const icon = size === "lg" ? "h-12 w-12" : "h-11 w-11";

  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden="true" className={`relative ${icon}`}>
        <Image
          src="/logo-black.png"
          alt=""
          fill
          className="object-contain dark:hidden"
          priority={false}
        />
        <Image
          src="/logo-white.png"
          alt=""
          fill
          className="hidden object-contain dark:block"
          priority={false}
        />
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