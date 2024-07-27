import { NextRequest, NextResponse } from "next/server";
import { LOGIN_VALIDATE_POST } from "./functions/api";

export async function middleware(request: NextRequest) {
  const next = NextResponse.next();

  const SSO = request.cookies.get("CEFETID_SSO")?.value;
  if (!SSO) return next;

  const { url, options } = LOGIN_VALIDATE_POST(SSO);
  const response = await fetch(url, options);
  const { isAuthenticatedUser } = await response.json();

  if (!isAuthenticatedUser) {
    next.cookies.delete("CEFETID_SSO");
    next.cookies.delete("CEFETID_STD");
    return next;
  }

  return next;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
