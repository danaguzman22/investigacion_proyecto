import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  PLAYER_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(
  request: NextRequest
) {
  const response =
    NextResponse.redirect(
      new URL(
        "/acceso",
        request.url
      ),
      303
    );

  response.cookies.set({
    name: PLAYER_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure:
      process.env.NODE_ENV ===
      "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}