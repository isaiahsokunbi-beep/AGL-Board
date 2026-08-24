import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { launchPdfBrowser } from "@/lib/pdf/browser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FILE_NAME = "Agriarche-H1-2026-Board-Paper.pdf";
/** UA allowed through middleware crawler block for authenticated PDF renders */
export const PDF_RENDER_UA = "AGL-Board-PDF/1.0";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookie = request.headers.get("cookie") ?? "";
  const origin = new URL(request.url).origin;
  const target = `${origin}/?pdf=1`;

  let browser: Awaited<ReturnType<typeof launchPdfBrowser>> | null = null;

  try {
    browser = await launchPdfBrowser();
    const page = await browser.newPage();

    await page.setUserAgent(
      `${PDF_RENDER_UA} Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36`,
    );
    await page.setExtraHTTPHeaders({
      Accept: "text/html,application/xhtml+xml",
      Cookie: cookie,
    });

    await page.goto(target, {
      waitUntil: "networkidle0",
      timeout: 45_000,
    });

    // Wait for hero + gallery images to decode
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
              }),
        ),
      );
    });

    // Hide chrome only — keep screen layout/charts (closer to the live webpage
    // than @media print, which swaps charts for tables).
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
