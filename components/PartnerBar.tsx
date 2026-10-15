import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PartnerBar() {
  const t = useTranslations("PartnerBar");

  return (
    <div className="border-b border-border bg-surface-2">
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-center px-4 sm:h-14 sm:px-6">
        <a
          href="https://linklyhub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-foreground sm:text-base"
        >
          <Image
            src="/linklyhub-logo.png"
            alt=""
            width={1080}
            height={1350}
            loading="lazy"
            decoding="async"
            className="h-6 w-auto shrink-0 sm:h-7"
          />
          <span>{t("text")}</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
