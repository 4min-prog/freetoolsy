import { getTranslations } from "next-intl/server";
import { ADS_CLIENT, ADS_ENABLED } from "@/lib/ads";
import AdSlotClient from "@/components/AdSlotClient";

export default async function AdSlot({
  slot = "bottom",
}: {
  slot?: "top" | "bottom";
}) {
  const t = await getTranslations("AdSlot");
  const elementId = slot === "top" ? "ad-top" : "ad-bottom";
  const adSlotId =
    (slot === "top"
      ? process.env.NEXT_PUBLIC_ADS_SLOT_TOP
      : process.env.NEXT_PUBLIC_ADS_SLOT_BOTTOM) || "auto";

  if (!ADS_ENABLED) {
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
      <AdSlotClient
        elementId={elementId}
        clientId={ADS_CLIENT}
        slotId={adSlotId}
      />
    </div>
  );
}
