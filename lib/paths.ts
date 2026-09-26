import type { Locale } from "@/i18n/routing";

export const siteUrl = "https://www.freetoolsy.com";

export function toolPath(locale: Locale, slug: string) {
  return locale === "tr" ? `/araclar/${slug}` : `/tools/${slug}`;
}

export function categoryPath(locale: Locale, id: string) {
  return locale === "tr" ? `/kategoriler/${id}` : `/categories/${id}`;
}

export function toolUrl(locale: Locale, slug: string) {
  return locale === "tr" ? `${siteUrl}/tr/araclar/${slug}` : `${siteUrl}/tools/${slug}`;
}

export function categoryUrl(locale: Locale, id: string) {
  return locale === "tr"
    ? `${siteUrl}/tr/kategoriler/${id}`
    : `${siteUrl}/categories/${id}`;
}

export function localizedUrl(locale: Locale, path: string) {
  return locale === "tr" ? `${siteUrl}/tr${path}` : `${siteUrl}${path}`;
}
