import { existsSync } from "fs";
import type { Browser } from "puppeteer-core";

const VIEWPORT = { width: 1280, height: 1800, deviceScaleFactor: 1 } as const;

/** CDP calls (evaluate, pdf) need headroom for a long image-heavy board paper */
const PROTOCOL_TIMEOUT_MS = 180_000;

const BASE_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--font-render-hinting=none",
] as const;

type LaunchFn = (options?: Record<string, unknown>) => Promise<Browser>;

function systemChromePath(): string | null {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  const candidates =
    process.platform === "darwin"
      ? [
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          "/Applications/Chromium.app/Contents/MacOS/Chromium",
          "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
        ]
      : process.platform === "win32"
        ? [
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          ]
        : [
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
            "/snap/bin/chromium",
          ];

  return candidates.find((p) => existsSync(p)) ?? null;
}

async function launchWith(
  launch: LaunchFn,
  options: Record<string, unknown>,
): Promise<Browser> {
  return launch({
    protocolTimeout: PROTOCOL_TIMEOUT_MS,
    defaultViewport: VIEWPORT,
    ...options,
  });
}

export async function launchPdfBrowser(): Promise<Browser> {
  const isServerless = Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.PDF_USE_SERVERLESS_CHROMIUM === "1",
  );

  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    return launchWith(puppeteer.default.launch.bind(puppeteer.default) as LaunchFn, {
      args: [...chromium.args, ...BASE_ARGS],
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = await import("puppeteer-core");
  const chromePath = systemChromePath();

  if (chromePath) {
    return launchWith(puppeteer.default.launch.bind(puppeteer.default) as LaunchFn, {
      executablePath: chromePath,
      headless: true,
      args: [...BASE_ARGS],
    });
  }

  try {
    return await launchWith(
      puppeteer.default.launch.bind(puppeteer.default) as LaunchFn,
      {
        channel: "chrome",
        headless: true,
        args: [...BASE_ARGS],
      },
    );
  } catch {
    const full = await import("puppeteer");
    return launchWith(full.default.launch.bind(full.default) as LaunchFn, {
      headless: true,
      args: [...BASE_ARGS],
    });
  }
}
