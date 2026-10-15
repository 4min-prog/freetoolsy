import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PartnerBar() {
  const t = useTranslations("PartnerBar");

  return (
    <a
      href="https://linklyhub.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block border-b border-border bg-surface-2 text-sm text-muted transition-colors hover:text-foreground"
    >
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-center gap-2 px-4 sm:h-12 sm:px-6">
        <Image
          src="/linklyhub-logo.png"
          alt=""
          width={1080}
          height={1350}
          loading="lazy"
          decoding="async"
          className="h-5 w-auto shrink-0 sm:h-6"
        />
        <span>{t("text")}</span>
        <span aria-hidden="true">&rarr;</span>
      </div>
    </a>
  );
}
