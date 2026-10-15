import Image from "next/image";
import { useTranslations } from "next-intl";

const ITEM_COUNT = 10;

export default function PartnerBar() {
  const t = useTranslations("PartnerBar");
  const texts = t.raw("texts") as string[];

  return (
    <a
      href="https://linklyhub.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={texts[0]}
      className="block border-b border-[#2c303a] bg-[#242730] text-sm text-[#9aa1b0] transition-colors hover:text-[#e9ebf0] dark:border-[#e2e5eb] dark:bg-[#edeff3] dark:text-[#4d5464] dark:hover:text-[#17181c]"
    >
      <div aria-hidden="true" className="partner-marquee-mask overflow-hidden">
        <div className="partner-marquee h-10 items-center sm:h-12">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center gap-8 pr-8">
              {Array.from({ length: ITEM_COUNT }).map((_, index) => (
                <span
                  key={index}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap"
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
                  <span>{texts[index % texts.length]}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}
