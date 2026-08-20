type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

export function softBan(ip: string, durationMs = 86_400_000) {
  buckets.set(`ban:${ip}`, { count: 999, resetAt: Date.now() + durationMs });
}

export function isSoftBanned(ip: string): boolean {
  const entry = buckets.get(`ban:${ip}`);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    buckets.delete(`ban:${ip}`);
    return false;
  }
  return true;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
