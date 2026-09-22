"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");
  const other = routing.locales.find((item) => item !== locale) ?? "tr";

  return (
    <Link
      href={pathname}
      locale={other}
      aria-label={other === "tr" ? t("switchToTurkish") : t("switchToEnglish")}
      className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-xs font-semibold uppercase text-muted transition-colors hover:border-strong hover:text-text"
    >
      {other}
    </Link>
  );
}