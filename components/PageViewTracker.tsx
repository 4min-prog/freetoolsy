"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageView } from "@/lib/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pageView();
  }, [pathname]);

  return null;
}
