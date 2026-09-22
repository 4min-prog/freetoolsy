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
          className="flex w-full items-center justify-center rounded border border-dashed border-gray-700 bg-gray-100/5 text-sm text-gray-500"
        >
          {t("advertisement")}
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