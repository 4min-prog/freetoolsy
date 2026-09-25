"use client";

import { useEffect, useRef } from "react";
import { CONSENT_EVENT, hasAccepted } from "@/lib/consent";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlotClient({
  elementId,
  clientId,
  slotId,
}: {
  elementId: string;
  clientId: string;
  slotId: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    const push = () => {
      if (pushed.current) return;
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushed.current = true;
      } catch {
        pushed.current = false;
      }
    };

    if (hasAccepted()) {
      push();
      return;
    }

    const onGrant = (event: Event) => {
      if ((event as CustomEvent<string>).detail === "accepted") push();
    };
    window.addEventListener(CONSENT_EVENT, onGrant);
    return () => window.removeEventListener(CONSENT_EVENT, onGrant);
  }, []);

  return (
    <ins
      id={elementId}
      className="adsbygoogle"
      style={{ display: "block", minHeight: "90px" }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
