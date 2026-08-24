import { NextResponse } from "next/server";
import { listAccess } from "@/lib/access/store";
import { isAuthenticated, verifyPassphrase } from "@/lib/auth/session";

/**
 * List who accessed the board paper.
 * Requires an authenticated session plus `x-admin-passphrase` matching BOARD_PASSPHRASE.
 */
export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminPass = request.headers.get("x-admin-passphrase") ?? "";
  if (!verifyPassphrase(adminPass)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const events = await listAccess();
  return NextResponse.json({ events });
}
