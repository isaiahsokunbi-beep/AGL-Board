import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isBlockedUserAgent } from "@/lib/crawlers";
import { clientIp, isSoftBanned, rateLimit, softBan } from "@/lib/rate-limit";

const PUBLIC_PATHS = [
  "/gate",
  "/api/gate",
  "/robots.txt",
  "/llms.txt",
  "/ai.txt",
  "/fonts",
  "/images",
  "/brand",
  "/agriarche-logo.svg",
  "/_next",
  "/favicon.ico",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent");

  if (isSoftBanned(ip)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (pathname === "/do-not-follow") {
    softBan(ip);
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!isPublic(pathname)) {
    if (isBlockedUserAgent(ua)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const accept = request.headers.get("accept") ?? "";
    if (!accept.includes("text/html") && !pathname.startsWith("/api/")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const rl = rateLimit(`doc:${ip}`, 60, 60_000);
    if (!rl.allowed) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const session = request.cookies.get("agl_board_session")?.value;
    if (session !== "authenticated") {
      const url = request.nextUrl.clone();
      url.pathname = "/gate";
      url.search = "";
      return NextResponse.rewrite(url);
    }
  }

  if (pathname === "/gate" || pathname === "/api/gate") {
    const rl = rateLimit(`gate:${ip}`, 5, 15 * 60_000);
    if (!rl.allowed) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
