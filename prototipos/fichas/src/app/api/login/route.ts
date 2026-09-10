import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createSessionToken,
  PLAYER_COOKIE_NAME,
  PLAYER_SESSION_MAX_AGE,
  validateCredentials,
} from "@/lib/auth";

export async function POST(
  request: NextRequest
) {
  try {
    const formData =
      await request.formData();

    const username =
      formData.get("username");

    const password =
      formData.get("password");

    if (
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.redirect(
        new URL(
          "/acceso?error=1",
          request.url
        ),
        303
      );
    }

    const role =
      validateCredentials(
        username,
        password
      );

    if (!role) {
      return NextResponse.redirect(
        new URL(
          "/acceso?error=1",
          request.url
        ),
        303
      );
    }

    const sessionToken =
      createSessionToken(role);

    const response =
      NextResponse.redirect(
        new URL(
          "/jugador",
          request.url
        ),
        303
      );

    response.cookies.set({
      name: PLAYER_COOKIE_NAME,
      value: sessionToken,

      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      maxAge:
        PLAYER_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error(
      "Error iniciando sesión:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/acceso?error=config",
        request.url
      ),
      303
    );
  }
}