"use client";

import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

export default function SampleButton({ onApply }: { onApply: () => void }) {
  const t = useTranslations("Common");

  return (
    <button
      type="button"
      onClick={() => {
        onApply();
        showToast("sample");
      }}
      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {t("trySample")}
    </button>
  );
}