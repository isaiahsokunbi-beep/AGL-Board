import { NextResponse } from "next/server";
import { recordAccess } from "@/lib/access/store";
import { setSession, verifyPassphrase } from "@/lib/auth/session";
import { clientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const form = await request.formData();
  const passphrase = String(form.get("passphrase") ?? "");
  const viewerName = String(form.get("viewerName") ?? "").trim();

  if (!viewerName) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  if (!verifyPassphrase(passphrase)) {
    return NextResponse.json({ error: "Invalid passphrase" }, { status: 401 });
  }

  await setSession(viewerName);

  try {
    await recordAccess({
      viewerName,
      ip: clientIp(request),
      userAgent: request.headers.get("user-agent"),
      path: "/",
    });
  } catch (err) {
    console.error("Failed to record access event", err);
  }

  return NextResponse.redirect(new URL("/", request.url));
}
