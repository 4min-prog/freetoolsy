import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_TO ?? "support@freetoolsy.com";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const NAME_MAX = 80;
const EMAIL_MAX = 120;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 4000;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export const runtime = "nodejs";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function consume(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  bucket.count += 1;
  return {
    allowed: bucket.count <= RATE_LIMIT_MAX,
    retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

function fail(message: string, status: number, extra: Record<string, string> = {}) {
  return NextResponse.json({ ok: false, error: message }, { status, headers: extra });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const limit = consume(clientIp(request));
  if (!limit.allowed) {
    return fail("too_many_requests", 429, { "Retry-After": String(limit.retryAfter) });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("invalid_body", 400);
  }

  if (typeof payload !== "object" || payload === null) return fail("invalid_body", 400);
  const body = payload as Record<string, unknown>;

  if (typeof body.company === "string" && body.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) return fail("fill_all_fields", 400);
  if (name.length > NAME_MAX || email.length > EMAIL_MAX || message.length > MESSAGE_MAX) {
    return fail("message_too_long", 400);
  }
  if (message.length < MESSAGE_MIN) return fail("message_too_short", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail("invalid_email", 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return fail("service_unavailable", 503);

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM ?? TO_EMAIL;

  try {
    const result = await resend.emails.send({
      from,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[FreetoolsY] ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
      html: `<p style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escapeHtml(
        message
      )}</p><hr style="border:none;border-top:1px solid #e2e8f0"><p style="font-family:system-ui,sans-serif;color:#475569;font-size:14px">${escapeHtml(
        name
      )} · <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
    });

    if (result.error) {
      console.error("[contact] resend error:", result.error.message);
      return fail("delivery_failed", 502);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.error(`[contact] send failed: ${reason}`);
    return fail("delivery_failed", 502);
  }
}
