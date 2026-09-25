declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushToDataLayer(args: unknown[]): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function track(
  event: string,
  params: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
    return;
  }
  pushToDataLayer(["event", event, params]);
}

export function pageView(): void {
  if (typeof window === "undefined") return;
  pushToDataLayer([
    "event",
    "page_view",
    {
      page_path: window.location.pathname + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
      page_language: document.documentElement.lang || undefined,
    },
  ]);
}

export function toolView(slug: string): void {
  track("tool_view", { tool_slug: slug });
}

export function toolUse(slug: string, action: string): void {
  track("tool_use", { tool_slug: slug, tool_action: action });
}
