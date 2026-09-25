import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LEGACY_EN_PATHS: [RegExp, (slug: string) => string][] = [
  [/^\/araclar\/([^/]+)\/?$/, (slug) => `/tools/${slug}`],
  [/^\/kategoriler\/([^/]+)\/?$/, (id) => `/categories/${id}`],
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const [pattern, target] of LEGACY_EN_PATHS) {
    const match = pathname.match(pattern);
    if (!match) continue;
    const url = request.nextUrl.clone();
    url.pathname = target(match[1]);
    return NextResponse.redirect(url, 301);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
