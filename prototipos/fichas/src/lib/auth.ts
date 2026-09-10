import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "crypto";

import type { RoleId } from "@/lib/fichas";

export const PLAYER_COOKIE_NAME =
  "cd_player_session";

export const PLAYER_SESSION_MAX_AGE =
  60 * 60 * 6; // 6 horas

const validRoles: RoleId[] = [
  "buho",
  "zorro",
  "castor",
  "toro",
  "ardilla",
];

function isRoleId(
  value: string
): value is RoleId {
  return validRoles.includes(
    value as RoleId
  );
}

function getPasswordForRole(
  role: RoleId
): string | undefined {
  const passwords: Record<
    RoleId,
    string | undefined
  > = {
    buho:
      process.env.BUHO_PASSWORD,

    zorro:
      process.env.ZORRO_PASSWORD,

    castor:
      process.env.CASTOR_PASSWORD,

    toro:
      process.env.TORO_PASSWORD,

    ardilla:
      process.env.ARDILLA_PASSWORD,
  };

  return passwords[role];
}

function getSessionSecret() {
  const secret =
    process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "Falta SESSION_SECRET en las variables de entorno."
    );
  }

  return secret;
}

function createSignature(
  role: RoleId
) {
  return createHmac(
    "sha256",
    getSessionSecret()
  )
    .update(role)
    .digest("hex");
}

export function validateCredentials(
  username: string,
  password: string
): RoleId | null {
  const normalizedUsername =
    username
      .trim()
      .toLowerCase();

  if (
    !isRoleId(normalizedUsername)
  ) {
    return null;
  }

  const expectedPassword =
    getPasswordForRole(
      normalizedUsername
    );

  if (
    !expectedPassword ||
    password !== expectedPassword
  ) {
    return null;
  }

  return normalizedUsername;
}

export function createSessionToken(
  role: RoleId
) {
  const signature =
    createSignature(role);

  return `${role}.${signature}`;
}

export function verifySessionToken(
  token?: string
): RoleId | null {
  if (!token) {
    return null;
  }

  const [
    roleText,
    receivedSignature,
  ] = token.split(".");

  if (
    !roleText ||
    !receivedSignature ||
    !isRoleId(roleText)
  ) {
    return null;
  }

  const expectedSignature =
    createSignature(roleText);

  const receivedBuffer =
    Buffer.from(
      receivedSignature,
      "utf8"
    );

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      "utf8"
    );

  if (
    receivedBuffer.length !==
    expectedBuffer.length
  ) {
    return null;
  }

  const valid =
    timingSafeEqual(
      receivedBuffer,
      expectedBuffer
    );

  if (!valid) {
    return null;
  }

  return roleText;
}