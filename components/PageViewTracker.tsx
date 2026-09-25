"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageView } from "@/lib/analytics";
import { CONSENT_EVENT, hasAccepted } from "@/lib/consent";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (hasAccepted()) pageView();
  }, [pathname]);

  useEffect(() => {
    const onGrant = () => {
      if (hasAccepted()) pageView();
    };
    window.addEventListener(CONSENT_EVENT, onGrant);
    return () => window.removeEventListener(CONSENT_EVENT, onGrant);
  }, []);

  return null;
}
