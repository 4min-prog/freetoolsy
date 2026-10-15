const PARTNER_BAR_KEY = "partner_bar_dismissed";

export function isPartnerBarDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PARTNER_BAR_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissPartnerBar(): void {
  try {
    window.localStorage.setItem(PARTNER_BAR_KEY, "1");
  } catch {
    return;
  }
}
