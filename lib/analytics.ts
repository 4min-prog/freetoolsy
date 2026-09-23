declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(
  event: string,
  params: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", event, params);
}

export function toolView(slug: string): void {
  track("tool_view", { tool_slug: slug });
}

export function toolUse(slug: string, action: string): void {
  track("tool_use", { tool_slug: slug, tool_action: action });
}