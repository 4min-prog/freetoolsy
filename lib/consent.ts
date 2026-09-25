export const CONSENT_KEY = "cookie_consent";
export const CONSENT_EVENT = "cookie-consent-change";

export type Consent = "accepted" | "rejected";

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function hasAccepted(): boolean {
  return getConsent() === "accepted";
}

export function setConsent(value: Consent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* localStorage unavailable (private browsing) */
  }
  window.dispatchEvent(
    new CustomEvent<Consent>(CONSENT_EVENT, { detail: value })
  );
}

export function onConsentChange(
  listener: (value: Consent) => void
): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<Consent>).detail;
    if (detail === "accepted" || detail === "rejected") listener(detail);
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
