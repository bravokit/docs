import { hasLocale } from "next-intl";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { isPageSlug } from "@/features/docs/pages";
import { routing } from "@/i18n/routing";

// Two jobs, both about the response, never about access (every page is public):
// 1. Languages (next-intl): English pages keep their address, other languages get a prefix
//    (/zh/start/quick-start); a first visit follows the browser's language and a cookie remembers
//    the choice.
// 2. Addresses that are no page show the 404 page with a 404 status. The docs route would render
//    it too, but only after streaming a prerendered shell that had already answered 200.
const handleLanguage = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const response = handleLanguage(request);
  if (response.headers.has("location")) return response;

  const [, first = "", ...rest] = request.nextUrl.pathname.split("/");
  const prefixed = hasLocale(routing.locales, first);
  const path = (prefixed ? rest : [first, ...rest]).filter(Boolean).join("/");
  if (path === "" || isPageSlug(path)) return response;

  const locale = prefixed ? first : routing.defaultLocale;
  return NextResponse.rewrite(new URL(`/${locale}/page-not-found`, request.url), {
    headers: response.headers,
  });
}

export const config = {
  // Every page; not Next.js internals, the share image or files like robots.txt.
  matcher: ["/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
