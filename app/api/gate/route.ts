import { NextResponse } from "next/server";
import { setSession, verifyPassphrase } from "@/lib/auth/session";

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
  return NextResponse.redirect(new URL("/", request.url));
}
