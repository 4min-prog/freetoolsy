"use client";

import { useEffect, useRef, useState } from "react";
import { getConsent, onConsentChange } from "@/lib/consent";
import {
  ADSTERRA_LEADERBOARD,
  ADSTERRA_MEDIUM,
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_SRC,
  type AdsterraIframeUnit,
} from "@/lib/adsterra";

function IframeAd({ unit }: { unit: AdsterraIframeUnit }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    const options = JSON.stringify({
      key: unit.key,
      format: "iframe",
      height: unit.height,
      width: unit.width,
      params: {},
    });
    doc.open();
    doc.write(
      `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body><script type="text/javascript">atOptions = ${options};<\/script><script type="text/javascript" src="${unit.src}"><\/script></body></html>`
    );
    doc.close();
  }, [unit]);

  return (
    <iframe
      ref={ref}
      title="Advertisement"
      width={unit.width}
      height={unit.height}
      scrolling="no"
      style={{ border: 0, overflow: "hidden" }}
    />
  );
}

function NativeAd() {
  useEffect(() => {
    if (document.getElementById("adsterra-native-script")) return;
    const script = document.createElement("script");
    script.id = "adsterra-native-script";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ADSTERRA_NATIVE_SRC;
    document.body.appendChild(script);
  }, []);

  return <div id={ADSTERRA_NATIVE_CONTAINER_ID} className="w-full" />;
}

export default function AdsterraAds({
  placement,
}: {
  placement: "top" | "bottom";
}) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(getConsent() === "accepted");
    return onConsentChange((value) => setAccepted(value === "accepted"));
  }, []);

  if (!accepted) return null;

  if (placement === "top") {
    return (
      <div className="mx-auto flex w-full max-w-7xl justify-center overflow-hidden px-4 py-3">
        <div className="hidden md:block">
          <IframeAd unit={ADSTERRA_LEADERBOARD} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-6">
      <NativeAd />
      <IframeAd unit={ADSTERRA_MEDIUM} />
    </div>
  );
}
