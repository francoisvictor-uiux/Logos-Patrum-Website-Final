import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "./lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  // Arabic-first: any locale-less path lands on the default (ar). English via switcher.
  request.nextUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|fonts|images|favicon.ico|.*\\..*).*)"],
};
