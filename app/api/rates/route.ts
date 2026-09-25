import { NextResponse } from "next/server";

const RATES_URL = "https://open.er-api.com/v6/latest/USD";
const TTL_MS = 60 * 60 * 1000;

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const BUCKET_PRUNE_THRESHOLD = 5000;

const ALLOWED_ORIGINS = new Set([
  "https://freetoolsy.com",
  "https://www.freetoolsy.com",
]);

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

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function pruneBuckets(now: number): void {
  if (buckets.size <= BUCKET_PRUNE_THRESHOLD) return;
  const expired: string[] = [];
  buckets.forEach((bucket, ip) => {
    if (now >= bucket.resetAt) expired.push(ip);
  });
  expired.forEach((ip) => buckets.delete(ip));
}

function consume(ip: string): { allowed: boolean; retryAfter: number; remaining: number } {
  const now = Date.now();
  pruneBuckets(now);

  const bucket = buckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0, remaining: RATE_LIMIT_MAX - 1 };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= RATE_LIMIT_MAX,
    retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    remaining: Math.max(0, RATE_LIMIT_MAX - bucket.count),
  };
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function json(body: unknown, init: ResponseInit, extra: Record<string, string> = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...init.headers, ...extra },
  });
}

export async function OPTIONS(request: Request) {
  if (!originAllowed(request)) {
    return json({ error: "Forbidden" }, { status: 403 }, corsHeaders(request));
  }
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: Request) {
  if (!originAllowed(request)) {
    return json({ error: "Forbidden" }, { status: 403 }, corsHeaders(request));
  }

  const cors = corsHeaders(request);
  const limit = consume(clientIp(request));
  const rateHeaders = {
    ...cors,
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
    "X-RateLimit-Remaining": String(limit.remaining),
  };

  if (!limit.allowed) {
    return json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { ...rateHeaders, "Retry-After": String(limit.retryAfter) },
      }
    );
  }

  if (cached && Date.now() - cachedAt < TTL_MS) {
    return json(
      {
        base: "USD",
        rates: cached.rates,
        updatedAt: cached.updatedAt,
        live: true,
      },
      { headers: rateHeaders }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(RATES_URL, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`rates api responded ${response.status}`);
    }

    const data = await response.json();
    if (data?.result !== "success" || !data?.rates) {
      throw new Error("rates api returned malformed payload");
    }

    cached = {
      rates: data.rates,
      updatedAt:
        typeof data.time_last_update_unix === "number"
          ? data.time_last_update_unix
          : null,
    };
    cachedAt = Date.now();

    return json(
      {
        base: "USD",
        rates: cached.rates,
        updatedAt: cached.updatedAt,
        live: true,
      },
      { headers: rateHeaders }
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.error(`[rates] upstream fetch failed, serving fallback: ${reason}`);

    cached = { rates: FALLBACK_RATES, updatedAt: null };
    cachedAt = Date.now();

    return json(
      {
        base: "USD",
        rates: FALLBACK_RATES,
        updatedAt: null,
        live: false,
        error: "upstream unavailable, serving fallback rates",
      },
      { headers: rateHeaders }
    );
  } finally {
    clearTimeout(timeout);
  }
}
