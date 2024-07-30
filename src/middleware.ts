import { NextRequest, NextResponse } from "next/server";
import { LOGIN_VALIDATE_POST } from "./functions/api";

const redirectToLogin = (request: NextRequest): NextResponse => {
  const response = NextResponse.redirect(new URL("/auth/login", request.url));
  return clearAuthCookies(response);
};

const clearAuthCookies = (response: NextResponse): NextResponse => {
  response.cookies.delete("CEFETID_SSO");
  response.cookies.delete("CEFETID_STD");
  return response;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const SSO = request.cookies.get("CEFETID_SSO")?.value;
  if (!SSO && pathname.startsWith("/aluno")) return redirectToLogin(request);

  if (SSO) {
    const { url, options } = LOGIN_VALIDATE_POST(SSO);
    const response = await fetch(url, options);
    const { isAuthenticatedUser } = await response.json();

    if (!isAuthenticatedUser) {
      const response = pathname.startsWith("/aluno")
        ? redirectToLogin(request)
        : NextResponse.next();

      return clearAuthCookies(response);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
