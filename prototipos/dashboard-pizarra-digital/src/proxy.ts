import type {
  NextRequest,
} from "next/server";

import {
  NextResponse,
} from "next/server";

const COOKIE_NAME =
  "nexus_master_session";

export function proxy(
  request: NextRequest
) {
  const expectedSecret =
    process.env
      .MASTER_SESSION_SECRET;

  const sessionCookie =
    request.cookies
      .get(COOKIE_NAME)
      ?.value;

  const hasValidSession =
    Boolean(expectedSecret) &&
    sessionCookie ===
      expectedSecret;

  if (!hasValidSession) {
    const loginUrl =
      new URL(
        "/acceso-master",
        request.url
      );

    return NextResponse.redirect(
      loginUrl
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/master/:path*",
  ],
};