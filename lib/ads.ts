/**
 * AdSense Auto Ads.
 *
 * Auto Ads modunda Google reklamlari sitenin uygun bosluklarina kendisi
 * yerlestirir; elle <ins data-ad-slot> yerlesimi kullanilmaz. Tek entegrasyon
 * noktasi adsbygoogle.js script'idir (components/CookieBanner.tsx icinde,
 * yalnizca cerez rizasi verildiginde yuklenir).
 *
 * Manuel slot kullanmak istersen: AdSense > Ad units > responsive display
 * olustur ve NEXT_PUBLIC_ADS_SLOT_TOP / NEXT_PUBLIC_ADS_SLOT_BOTTOM degerlerini
 * tanimla, sonra sayfalara gercek <ins> yerlesimleri geri ekle.
 */
export const ADS_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
  process.env.NEXT_PUBLIC_ADS_CLIENT ||
  "ca-pub-8880626756482815";

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
