import { NextResponse } from "next/server";

const COOKIE_NAME = "nexus_master_session";

export async function POST(request: Request) {
  const formData = await request.formData();

  const password =
    formData.get("password");

  const masterPassword =
    process.env.MASTER_PASSWORD;

  const sessionSecret =
    process.env.MASTER_SESSION_SECRET;

  // Verificamos que las variables existan
  if (
    !masterPassword ||
    !sessionSecret
  ) {
    console.error(
      "Faltan MASTER_PASSWORD o MASTER_SESSION_SECRET"
    );

    return NextResponse.redirect(
      new URL(
        "/acceso-master?error=config",
        request.url
      ),
      303
    );
  }

  // Contraseña incorrecta
  if (
    typeof password !== "string" ||
    password !== masterPassword
  ) {
    return NextResponse.redirect(
      new URL(
        "/acceso-master?error=1",
        request.url
      ),
      303
    );
  }

  // Contraseña correcta
  const response =
    NextResponse.redirect(
      new URL(
        "/master",
        request.url
      ),
      303
    );

  response.cookies.set({
    name: COOKIE_NAME,
    value: sessionSecret,

    httpOnly: true,

    secure:
      process.env.NODE_ENV ===
      "production",

    sameSite: "lax",

    path: "/",

    // 15 min
    maxAge: 60 * 15,
  });

  return response;
}