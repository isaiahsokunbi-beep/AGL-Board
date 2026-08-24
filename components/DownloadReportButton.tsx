"use client";

export function DownloadReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-brand-green/30 bg-surface-card px-5 py-3 text-sm font-semibold text-brand-green shadow-card backdrop-blur-sm transition-opacity hover:opacity-90"
      title="Download or print a copy formatted like this page (use Save as PDF in the print dialog)"
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
      Download report
    </button>
  );
}
