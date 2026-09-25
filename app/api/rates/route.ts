import { NextResponse } from "next/server";

const RATES_URL = "https://open.er-api.com/v6/latest/USD";
const TTL_MS = 60 * 60 * 1000;

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.88,
  TRY: 48.9,
  GBP: 0.76,
  JPY: 158.7,
  CNY: 6.72,
  AUD: 1.43,
  CAD: 1.41,
  CHF: 0.83,
  RUB: 84.5,
  AED: 3.67,
  SAR: 3.75,
  KWD: 0.31,
  QAR: 3.64,
  IRR: 42100,
  KRW: 1390,
  SGD: 1.3,
  NOK: 10.6,
  SEK: 10.3,
  DKK: 6.55,
  PLN: 3.9,
  CZK: 22.5,
  HUF: 355,
  RON: 4.35,
  ILS: 3.55,
  ZAR: 13.8,
  BRL: 4.95,
  MXN: 17.4,
  INR: 83.1,
  PKR: 278,
  NZD: 1.55,
};

let cached: { rates: Record<string, number>; updatedAt: number | null } | null = null;
let cachedAt = 0;

export const runtime = "nodejs";

export async function GET() {
  if (cached && Date.now() - cachedAt < TTL_MS) {
    return NextResponse.json({
      base: "USD",
      rates: cached.rates,
      updatedAt: cached.updatedAt,
      live: true,
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(RATES_URL, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`rates api ${response.status}`);
    const data = await response.json();
    if (data?.result !== "success" || !data?.rates) throw new Error("rates api malformed");

    cached = {
      rates: data.rates,
      updatedAt: typeof data.time_last_update_unix === "number" ? data.time_last_update_unix : null,
    };
    cachedAt = Date.now();

    return NextResponse.json({
      base: "USD",
      rates: cached.rates,
      updatedAt: cached.updatedAt,
      live: true,
    });
  } catch {
    cached = { rates: FALLBACK_RATES, updatedAt: null };
    cachedAt = Date.now();
    return NextResponse.json({
      base: "USD",
      rates: FALLBACK_RATES,
      updatedAt: null,
      live: false,
    });
  }
}