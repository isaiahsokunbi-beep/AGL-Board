import { existsSync } from "fs";
import type { Browser } from "puppeteer-core";

const VIEWPORT = { width: 1280, height: 1800, deviceScaleFactor: 1 } as const;

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

export async function launchPdfBrowser(): Promise<Browser> {
  const isServerless = Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.PDF_USE_SERVERLESS_CHROMIUM === "1",
  );

  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    return puppeteer.default.launch({
      args: chromium.args,
      defaultViewport: VIEWPORT,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = await import("puppeteer-core");
  const chromePath = systemChromePath();

  // Prefer the machine’s installed Chrome (avoids missing Puppeteer browser cache)
  if (chromePath) {
    return puppeteer.default.launch({
      executablePath: chromePath,
      headless: true,
      defaultViewport: VIEWPORT,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  }

  // Fall back to Puppeteer’s channel shortcut (Chrome for Testing / installed Chrome)
  try {
    return await puppeteer.default.launch({
      channel: "chrome",
      headless: true,
      defaultViewport: VIEWPORT,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  } catch {
    // Last resort: full puppeteer package (if its browser was installed)
    const full = await import("puppeteer");
    return full.default.launch({
      headless: true,
      defaultViewport: VIEWPORT,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    }) as unknown as Browser;
  }
}
