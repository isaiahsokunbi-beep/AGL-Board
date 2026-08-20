/**
 * Crawler / scraper blocklist — maintained 2026-08-20
 * Returns 403 for known automated agents on document routes.
 */
export const CRAWLER_BLOCKLIST: readonly string[] = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "Bytespider",
  "PerplexityBot",
  "Google-Extended",
  "Amazonbot",
  "Applebot-Extended",
  "Diffbot",
  "Omgili",
  "curl",
  "wget",
  "python-requests",
  "scrapy",
  "HeadlessChrome",
  "PetalBot",
  "cohere-ai",
  "FacebookBot",
  "ImagesiftBot",
];

export function isBlockedUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  return CRAWLER_BLOCKLIST.some((bot) => ua.includes(bot.toLowerCase()));
}
