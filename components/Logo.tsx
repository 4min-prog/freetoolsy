"use client";

import Image from "next/image";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const icon = size === "lg" ? "h-12 w-12" : "h-11 w-11";

  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden="true" className={`relative ${icon}`}>
        <Image
          src="/logo-black.png"
          alt="FreetoolsY"
          fill
          className="object-contain dark:hidden"
          priority={false}
        />
        <Image
          src="/logo-white.png"
          alt="FreetoolsY"
          fill
          className="hidden object-contain dark:block"
          priority={false}
        />
      </span>
      <span className="hidden leading-none min-[420px]:block">
        <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-text">
          free
        </span>
        <span className="mt-1 block text-[13px] font-extrabold uppercase tracking-[0.08em] text-accent">
          toolsY
        </span>
      </span>
    </span>
  );
}