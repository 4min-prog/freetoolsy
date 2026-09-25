export const ADS_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
  process.env.NEXT_PUBLIC_ADS_CLIENT ||
  "ca-pub-8880626756482815";

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
