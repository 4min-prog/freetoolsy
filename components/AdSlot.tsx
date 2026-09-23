import { getTranslations } from "next-intl/server";

export default async function AdSlot({
  slot = "bottom",
}: {
  slot?: "top" | "bottom";
}) {
  const t = await getTranslations("AdSlot");
  const adsEnabled =
    process.env.NEXT_PUBLIC_ADS_ENABLED === "true" &&
    Boolean(process.env.NEXT_PUBLIC_ADS_CLIENT);
  const clientId = process.env.NEXT_PUBLIC_ADS_CLIENT || "";
  const adSlotId =
    slot === "top"
      ? process.env.NEXT_PUBLIC_ADS_SLOT_TOP || ""
      : process.env.NEXT_PUBLIC_ADS_SLOT_BOTTOM || "";
  const elementId = slot === "top" ? "ad-top" : "ad-bottom";

  if (!adsEnabled || !adSlotId) {
    return (
      <div className="mt-8">
        <div
          id={elementId}
          style={{ minHeight: "90px" }}
          className="flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-surface-2/50"
        >
          <span className="flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1 text-xs text-faint">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-3.5 w-3.5"
            >
              <rect x="4" y="10" width="5" height="10" rx="1" />
              <rect x="10" y="6" width="5" height="14" rx="1" />
              <rect x="16" y="13" width="4" height="7" rx="1" />
            </svg>
            {t("advertisement")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <ins
        id={elementId}
        className="adsbygoogle"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client={clientId}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: "(window.adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      />
    </div>
  );
}