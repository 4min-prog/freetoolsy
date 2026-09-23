"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import SearchBox from "./SearchBox";

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Header");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label={t("searchLabel")}
    >
      <button
        type="button"
        aria-label={t("closeSearch")}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/40 backdrop-blur-md"
      />
      <div className="relative mx-auto mt-[18vh] w-full max-w-xl px-4">
        <SearchBox
          large
          autoFocus
          placeholder={t("searchPlaceholder")}
          onDone={onClose}
          onEsc={onClose}
        />
        <p className="mt-3 text-center text-xs text-white/70">
          {t("searchHint")}
        </p>
      </div>
    </div>
  );
}