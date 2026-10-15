/**
 * Adsterra ad units.
 *
 * Kullanim: components/AdsterraAds.tsx icinde, yalnizca cerez rizasi
 * ("accepted") verildiginde yuklenir. iframe formatli banner'lar izole bir
 * iframe icinde render edilir; boylece Adsterra'nin document.write tabanli
 * invoke script'i ana sayfayi etkilemeden calisir.
 */

export type AdsterraIframeUnit = {
  key: string;
  src: string;
  width: number;
  height: number;
};

export const ADSTERRA_NATIVE_SRC =
  "https://bauval.org/21/bfd659bd52cdb963102626fd4bec0f97";

export const ADSTERRA_NATIVE_CONTAINER_ID =
  "container-bfd659bd52cdb963102626fd4bec0f97";

export const ADSTERRA_LEADERBOARD: AdsterraIframeUnit = {
  key: "ca2ca9e5be40f64a53723d0d91d922e7",
  src: "https://bauval.org/22/ca2ca9e5be40f64a53723d0d91d922e7",
  width: 728,
  height: 90,
};

export const ADSTERRA_MEDIUM: AdsterraIframeUnit = {
  key: "652cc616132d81cc3125d7c7a4b374a7",
  src: "https://bauval.org/22/652cc616132d81cc3125d7c7a4b374a7",
  width: 300,
  height: 250,
};
