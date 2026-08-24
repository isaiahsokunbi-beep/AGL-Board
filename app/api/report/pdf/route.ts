import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { launchPdfBrowser } from "@/lib/pdf/browser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FILE_NAME = "Agriarche-H1-2026-Board-Paper.pdf";
const PDF_RENDER_UA = "AGL-Board-PDF/1.0";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookie = request.headers.get("cookie") ?? "";
  const origin = new URL(request.url).origin;
  // pdf=1 skips annotations / chrome so network can settle
  const target = `${origin}/?pdf=1`;

  let browser: Awaited<ReturnType<typeof launchPdfBrowser>> | null = null;

  try {
    browser = await launchPdfBrowser();
    const page = await browser.newPage();

    page.setDefaultTimeout(60_000);
    page.setDefaultNavigationTimeout(60_000);

    await page.setUserAgent(
      `${PDF_RENDER_UA} Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36`,
    );
    await page.setExtraHTTPHeaders({
      Accept: "text/html,application/xhtml+xml",
      Cookie: cookie,
    });

    // Avoid networkidle0 — annotations / analytics can keep the network busy forever
    await page.goto(target, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.waitForSelector("article[data-annotatable]", { timeout: 30_000 });

    // Soft wait for images (capped) — never block the CDP session indefinitely
    await page
      .evaluate(async () => {
        const deadline = Date.now() + 12_000;
        const imgs = Array.from(document.images);

        await Promise.race([
          Promise.all(
            imgs.map(
              (img) =>
                new Promise<void>((resolve) => {
                  if (img.complete) {
                    resolve();
                    return;
                  }
                  const done = () => resolve();
                  img.addEventListener("load", done, { once: true });
                  img.addEventListener("error", done, { once: true });
                }),
            ),
          ),
          new Promise<void>((resolve) => {
            const ms = Math.max(0, deadline - Date.now());
            setTimeout(resolve, ms);
          }),
        ]);

        // Brief settle for layout / fonts
        await new Promise((r) => setTimeout(r, 400));
      })
      .catch(() => undefined);

    await page.addStyleTag({
      content: `
        .no-print,
        [data-comment-layer],
        [data-toc-rail],
        [data-progress-bar],
        [data-comment-sidebar],
        [data-gate] {
          display: none !important;
        }
        .watermark {
          opacity: 0.06 !important;
        }
        body {
          background: #fff !important;
        }
      `,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
      preferCSSPageSize: false,
      timeout: 120_000,
    });

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${FILE_NAME}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation failed", err);
    return NextResponse.json(
      { error: "PDF generation failed", detail: String(err) },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }
  }
}
