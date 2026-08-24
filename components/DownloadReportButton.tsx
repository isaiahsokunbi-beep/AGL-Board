"use client";

import { useState } from "react";

const FILE_NAME = "Agriarche-H1-2026-Board-Paper.pdf";

export function DownloadReportButton() {
  const [busy, setBusy] = useState(false);

  async function downloadPdf() {
    if (busy) return;
    setBusy(true);

    try {
      const res = await fetch("/api/report/pdf", {
        method: "GET",
        credentials: "same-origin",
        headers: { Accept: "application/pdf" },
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `PDF request failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = FILE_NAME;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed", err);
      window.alert(
        "Could not generate the PDF. You can use your browser’s print dialog and choose Save as PDF as a backup.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void downloadPdf()}
      disabled={busy}
      aria-busy={busy}
      className="no-print fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-brand-green/30 bg-surface-card px-5 py-3 text-sm font-semibold text-brand-green shadow-card backdrop-blur-sm transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
      title="Download the full board paper as a PDF"
    >
      <svg
        aria-hidden
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {busy ? "Preparing PDF…" : "Download report"}
    </button>
  );
}
