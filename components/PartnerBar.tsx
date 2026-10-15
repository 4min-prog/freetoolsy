"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PartnerBar({ onDismiss }: { onDismiss: () => void }) {
  const t = useTranslations("PartnerBar");

  return (
    <div className="relative border-b border-border bg-surface-2">
      <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-center px-10 sm:px-6">
        <a
          href="https://linklyhub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-foreground"
        >
          <Image
            src="/linklyhub-logo.png"
            alt=""
            width={1080}
            height={1350}
            loading="lazy"
            decoding="async"
            className="h-4 w-auto shrink-0"
          />
          <span>{t("text")}</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t("dismiss")}
        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-faint transition-colors hover:text-foreground sm:right-4"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
