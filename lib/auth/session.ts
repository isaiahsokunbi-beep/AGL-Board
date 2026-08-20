import { cookies } from "next/headers";

export const SESSION_COOKIE = "agl_board_session";
export const VIEWER_COOKIE = "agl_board_viewer";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function setSession(viewerName: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  jar.set(VIEWER_COOKIE, viewerName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(VIEWER_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value === "authenticated";
}

export async function getViewerName(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(VIEWER_COOKIE)?.value ?? null;
}

export function verifyPassphrase(passphrase: string): boolean {
  const expected = process.env.BOARD_PASSPHRASE;
  if (!expected) return passphrase === "dev-passphrase";
  return passphrase === expected;
}
