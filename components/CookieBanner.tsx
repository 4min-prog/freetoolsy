"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { getConsent, setConsent, type Consent } from "@/lib/consent";

const GA_ID = "G-6J6JB9SHKZ";
const GOATCOUNTER = "https://freetoolsy.goatcounter.com/count";

export default function CookieBanner({
  adsClient,
  adsEnabled,
}: {
  adsClient: string;
  adsEnabled: boolean;
}) {
  const t = useTranslations("CookieBanner");
  const [consent, setStoredConsent] = useState<Consent | null | "loading">(
    "loading"
  );

  useEffect(() => {
    setStoredConsent(getConsent());
  }, []);

  const decide = (value: Consent) => {
    setStoredConsent(value);
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="google-analytics-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GA_ID}",{send_page_view:false});`}
          </Script>
          {adsEnabled && (
            <Script
              id="adsense-loader"
              strategy="afterInteractive"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
              crossOrigin="anonymous"
            />
          )}
          <Script
            id="goatcounter"
            strategy="lazyOnload"
            data-goatcounter={GOATCOUNTER}
            src="https://gc.zgo.at/count.js"
          />
        </>
      )}

      {consent !== null && consent !== "accepted" && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t("title")}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 backdrop-blur"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm leading-relaxed text-muted">{t("text")}</p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => decide("rejected")}
                className="border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                {t("reject")}
              </button>
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
